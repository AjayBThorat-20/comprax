import fs from "fs"
import path from "path"
import { scanDir, resetScanner } from "./core/scanner.js"
import { createFilter } from "./core/filter.js"
import { compress, calculateCompressionRatio } from "./core/compressor.js"
import { organizeByDirectory, createTreeStructure } from "./core/organizer.js"
import { formatCombined, formatSummary } from "./core/formatter.js"
import { writeOutput } from "./core/writer.js"
import { writeOrganized } from "./core/multi-writer.js"
import { printStats } from "./utils/stats-printer.js"
import { startSpinner, succeedSpinner, updateSpinner, logWarning, logInfo } from "./utils/logger.js"
import chalk from "chalk"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export async function run(projectPath, options = {}) {
  const { 
    output = "comprax-output",
    combined = false,
    verbose = false,
    exclude = [],
    include = []
  } = options

  // Show configuration
  if (verbose) {
    console.log(chalk.cyan("Configuration:"))
    logInfo(`Mode: ${combined ? 'Combined (single file)' : 'Directory structure (multiple files)'}`)
    if (exclude.length > 0) {
      logInfo(`Excluding dirs: ${exclude.join(", ")}`)
    }
    if (include.length > 0) {
      logInfo(`Including only: ${include.join(", ")}`)
    }
    console.log()
  }

  const absolutePath = path.resolve(projectPath)

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Path does not exist: ${absolutePath}`)
  }

  const stat = fs.statSync(absolutePath)
  if (!stat.isDirectory()) {
    throw new Error(`Path is not a directory: ${absolutePath}`)
  }

  resetScanner()

  const shouldInclude = createFilter({ exclude, include })

  // Step 1: Scan
  startSpinner("Scanning project...")
  const allFiles = scanDir(absolutePath)
  succeedSpinner(`Found ${allFiles.length} total files`)

  // Step 2: Filter
  startSpinner("Filtering code files...")
  const filtered = allFiles.filter(shouldInclude)
  succeedSpinner(`Filtered to ${filtered.length} code files`)

  if (filtered.length === 0) {
    logWarning("No code files found to compress")
    return
  }

  // Step 3: Compress
  startSpinner("Compressing files...")
  
  const fileData = []
  let totalOriginalSize = 0
  let skippedFiles = 0
  let processedCount = 0

  for (const file of filtered) {
    try {
      const code = fs.readFileSync(file, "utf-8")
      const originalSize = code.length
      totalOriginalSize += originalSize

      if (originalSize > MAX_FILE_SIZE) {
        if (verbose) {
          logWarning(`Skipping large file: ${path.relative(absolutePath, file)}`)
        }
        skippedFiles++
        continue
      }

      const compressed = compress(code)

      fileData.push({
        path: file,
        code: compressed,
        originalSize
      })

      processedCount++
      
      if (processedCount % 10 === 0) {
        updateSpinner(`Compressing files... (${processedCount}/${filtered.length})`)
      }
    } catch (err) {
      if (verbose) {
        logWarning(`Could not read: ${path.relative(absolutePath, file)}`)
      }
      skippedFiles++
      continue
    }
  }

  succeedSpinner(`Processed ${fileData.length} files`)

  if (fileData.length === 0) {
    throw new Error("No files could be processed")
  }

  // Calculate stats
  const compressedSize = fileData.reduce((sum, f) => sum + f.code.length, 0)
  const savedPercent = calculateCompressionRatio(totalOriginalSize, compressedSize)

  const stats = {
    totalFiles: fileData.length,
    skippedFiles,
    originalSize: totalOriginalSize,
    compressedSize,
    savedPercent
  }

  // Step 4: Format and write
  if (combined) {
    // Single file mode
    startSpinner("Formatting output...")
    const formattedOutput = formatCombined(fileData, absolutePath)
    succeedSpinner("Output formatted")

    const outputFile = output.endsWith('.txt') ? output : output + '.txt'
    startSpinner("Writing output file...")
    writeOutput(formattedOutput, outputFile)
    succeedSpinner(`Output written to: ${outputFile}`)
  } else {
    // Directory structure mode
    startSpinner("Organizing by directory...")
    const organized = organizeByDirectory(fileData, absolutePath)
    succeedSpinner(`Organized into ${organized.size} directories`)

    if (verbose) {
      console.log()
      console.log(createTreeStructure(organized))
      console.log()
    }

    startSpinner("Creating summary...")
    const summaryContent = formatSummary(organized, stats)
    succeedSpinner("Summary created")

    startSpinner("Writing files...")
    const projectName = path.basename(absolutePath)
    const result = writeOrganized(organized, output, projectName, summaryContent)
    succeedSpinner(`Written to: ${result.mainDir}/ (${result.filesWritten} files)`)
  }

  // Step 5: Display statistics
  printStats(stats)

  // Show next steps based on mode
  if (!combined) {
    console.log(chalk.green("\n💡 Directory structure created!"))
    console.log(chalk.white(`   Open ${output}/${path.basename(absolutePath)}/ to see organized files`))
    console.log(chalk.white(`   Start with _summary.txt for an overview\n`))
  }
}
