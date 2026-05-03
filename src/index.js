import fs from "fs"
import path from "path"
import { scanDir, resetScanner } from "./core/scanner.js"
import { createFilter } from "./core/filter.js"
import { compress, calculateCompressionRatio } from "./core/compressor.js"
import { detectExports, formatExports } from "./core/export-detector.js"
import { detectStack } from "./core/stack-detector.js"
import { generatePrompt, generateControlledPrompt } from "./core/prompt-generator.js"
import { organizeByDirectory, createTreeStructure } from "./core/organizer.js"
import { 
  formatCombined, 
  formatCombinedHybrid,
  formatSummary 
} from "./core/formatter.js"
import { writeOutput } from "./core/writer.js"
import { writeOrganized } from "./core/multi-writer.js"
import { printStats } from "./utils/stats-printer.js"
import { startSpinner, succeedSpinner, updateSpinner, logWarning, logInfo } from "./utils/logger.js"
import { parseAST } from "./core/parser/ast-parser.js"
import { extractStructure } from "./core/semantic/extractor.js"
import { summarizeStructure } from "./core/semantic/summarizer.js"
import { scoreStructure, shouldIncludeFile } from "./core/semantic/scorer.js"
import { loadCache, saveCache, hasFileChanged, getCachedData, setCachedData } from "./core/cache/hash.js"
import { estimateTokens } from "./utils/token-estimator.js"
import { buildContext } from "./core/context/context-engine.js"
import chalk from "chalk"

const MAX_FILE_SIZE = 5 * 1024 * 1024

export async function run(projectPath, options = {}) {
  const { 
    output = "comprax-output",
    combined = false,
    mode = "basic",
    verbose = false,
    exclude = [],
    include = [],
    semantic = false,
    smart = false,
    threshold = 5,
    incremental = false,
    top = null
  } = options

  if (verbose) {
    console.log(chalk.cyan("Configuration:"))
    logInfo(`Mode: ${mode === 'hybrid' ? 'Hybrid (with exports & stack)' : 'Basic'}`)
    if (semantic) logInfo("Semantic: Enabled")
    if (smart) logInfo(`Smart filtering: Enabled (threshold: ${threshold})`)
    if (incremental) logInfo("Incremental: Enabled")
    if (top) logInfo(`Top files: ${top}`)
    logInfo(`Output: ${combined ? 'Single file' : 'Directory structure'}`)
    if (exclude.length > 0) logInfo(`Excluding dirs: ${exclude.join(", ")}`)
    if (include.length > 0) logInfo(`Including only: ${include.join(", ")}`)
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

  const cacheDir = incremental ? path.join(absolutePath, ".comprax-cache") : null
  let cache = incremental ? loadCache(cacheDir) : {}

  resetScanner()
  const shouldInclude = createFilter({ exclude, include })

  startSpinner("Scanning project...")
  const allFiles = scanDir(absolutePath)
  succeedSpinner(`Found ${allFiles.length} total files`)

  startSpinner("Filtering code files...")
  const filtered = allFiles.filter(shouldInclude)
  succeedSpinner(`Filtered to ${filtered.length} code files`)

  if (filtered.length === 0) {
    logWarning("No code files found to compress")
    return
  }

  let stack = null
  if (mode === 'hybrid' || semantic) {
    startSpinner("Detecting project stack...")
    stack = detectStack(absolutePath)
    succeedSpinner(`Stack detected: ${stack.framework || stack.runtime}`)
  }

  startSpinner("Compressing files...")
  
  const fileData = []
  let totalOriginalSize = 0
  let skippedFiles = 0
  let cachedFiles = 0
  let processedCount = 0

  for (const file of filtered) {
    try {
      const code = fs.readFileSync(file, "utf-8")
      const originalSize = code.length
      totalOriginalSize += originalSize

      if (originalSize > MAX_FILE_SIZE) {
        fileData.push({
          path: file,
          code: `// [FILE TOO LARGE: ${(originalSize / 1024 / 1024).toFixed(1)}MB - SKIPPED]\n`,
          originalSize,
          exports: null,
          structure: null,
          summary: null,
          score: 0,
          skipped: true,
          skipReason: 'too_large'
        })
        skippedFiles++
        if (verbose) logWarning(`Skipped large file: ${path.relative(absolutePath, file)}`)
        continue
      }

      if (incremental && !hasFileChanged(file, code, cache)) {
        const cachedData = getCachedData(file, cache)
        if (cachedData && cachedData.data) {
          fileData.push(cachedData.data)
          cachedFiles++
          continue
        }
      }

      const compressed = compress(code)

      const data = {
        path: file,
        code: compressed,
        originalSize,
        exports: null,
        structure: null,
        summary: null,
        score: 0
      }
      
      if (mode === 'hybrid' || semantic || smart) {
        const ast = parseAST(code, file)
        
        if (ast) {
          data.structure = extractStructure(ast)
          data.score = scoreStructure(data.structure)

          if (smart && !shouldIncludeFile(data.structure, { smart, threshold })) {
            skippedFiles++
            continue
          }

          if (semantic) {
            data.summary = summarizeStructure(data.structure)
          }

          if (data.structure.exports && data.structure.exports.length > 0) {
            data.exports = formatExports(
              data.structure.exports.map(name => ({ name, type: 'ast' }))
            )
          } else {
            const detectedExports = detectExports(code, file)
            data.exports = formatExports(detectedExports)
          }
        } else {
          const detectedExports = detectExports(code, file)
          data.exports = formatExports(detectedExports)
        }
      }

      fileData.push(data)

      if (incremental) {
        setCachedData(file, code, data, cache)
      }

      processedCount++
      
      if (processedCount % 10 === 0) {
        updateSpinner(`Compressing files... (${processedCount}/${filtered.length})`)
      }
    } catch (err) {
      if (verbose) {
        logWarning(`Failed: ${path.relative(absolutePath, file)}`)
        console.error(err.message)
      }
      skippedFiles++
      continue
    }
  }

  fileData.sort((a, b) => {
    if ((b.score || 0) !== (a.score || 0)) {
      return (b.score || 0) - (a.score || 0)
    }
    return a.path.localeCompare(b.path)
  })

  if (top && fileData.length > top) {
    fileData.splice(top)
  }

  const statusMsg = cachedFiles > 0 
    ? `Processed ${processedCount} files, reused ${cachedFiles} from cache${skippedFiles > 0 ? `, skipped ${skippedFiles}` : ""}`
    : `Processed ${fileData.length} files${skippedFiles > 0 ? ` (skipped ${skippedFiles})` : ""}`;
  
  succeedSpinner(statusMsg)

  // BUILD CONTEXT ENGINE (NEW!)
  let context = null
  if (mode === 'hybrid' || semantic) {
    startSpinner("Building context...")
    context = buildContext(fileData, absolutePath)
    succeedSpinner(`Context built: ${context.functionIndex.length} functions, ${Object.keys(context.graph).length} files`)
  }

  if (incremental && cacheDir) {
    saveCache(cacheDir, cache)
  }

  if (fileData.length === 0) {
    throw new Error("No files could be processed")
  }

  const compressedSize = fileData.reduce((sum, f) => {
    return sum + (f.code?.length || 0)
  }, 0)

  const savedPercent = calculateCompressionRatio(totalOriginalSize, compressedSize)

  const stats = {
    totalFiles: fileData.length,
    skippedFiles,
    originalSize: totalOriginalSize,
    compressedSize,
    savedPercent
  }

  const projectName = path.basename(absolutePath)

  if (combined) {
    startSpinner("Formatting output...")
    const formattedOutput = mode === 'hybrid' || semantic
      ? formatCombinedHybrid(fileData, absolutePath, stack, projectName, semantic, context)
      : formatCombined(fileData, absolutePath)
    succeedSpinner("Output formatted")

    const outputFile = output.endsWith('.txt') ? output : output + '.txt'
    startSpinner("Writing output file...")
    writeOutput(formattedOutput, outputFile)
    succeedSpinner(`Output written to: ${outputFile}`)
    
    if (mode === 'hybrid' || semantic) {
      // Generate controlled prompt using context
  const promptContent = generateControlledPrompt({
    projectName,
    stack,
    contextText: formattedOutput,
    userTask: "Analyze this codebase and suggest improvements. Focus on architecture, reusability, and potential refactoring opportunities."
  })
      const promptFile = outputFile.replace('.txt', '-prompt.txt')
      fs.writeFileSync(promptFile, promptContent, 'utf-8')
      console.log(chalk.green(`📝 Generated prompt file: ${promptFile}`))
    }
  } else {
    startSpinner("Organizing by directory...")
    const organized = organizeByDirectory(fileData, absolutePath)
    succeedSpinner(`Organized into ${organized.size} directories`)

    if (verbose) {
      console.log()
      console.log(createTreeStructure(organized))
      console.log()
    }

    startSpinner("Creating summary...")
    const summaryContent = formatSummary(organized, stats, stack, projectName)
    succeedSpinner("Summary created")

    startSpinner("Writing files...")
    const result = writeOrganized(organized, output, projectName, summaryContent, mode, semantic)
    succeedSpinner(`Written to: ${result.mainDir}/ (${result.filesWritten} files)`)
    
    if (mode === 'hybrid' || semantic) {
      const promptContent = generatePrompt(stack, fileData.length, projectName)
      const promptPath = path.join(output, projectName, '_prompt.txt')
      fs.writeFileSync(promptPath, promptContent, 'utf-8')
      console.log(chalk.green(`📝 Generated prompt file: ${path.relative(process.cwd(), promptPath)}`))
    }
  }

  printStats(stats)

  if (!combined) {
    console.log(chalk.green("\n💡 Directory structure created!"))
    console.log(chalk.white(`   Open ${output}/${projectName}/ to see organized files`))
    console.log(chalk.white(`   Start with _summary.txt for an overview\n`))
  }
  
  if (mode === 'hybrid' || semantic) {
    console.log(chalk.cyan("✨ Enhanced features:"))
    console.log(chalk.white("   ✅ Export detection enabled"))
    console.log(chalk.white("   ✅ Stack analysis included"))
    console.log(chalk.white("   ✅ Smart prompt generated"))
    if (semantic) console.log(chalk.white("   ✅ Semantic summaries included"))
    if (smart) console.log(chalk.white(`   ✅ Smart filtering (threshold: ${threshold})`))
    if (incremental) console.log(chalk.white("   ✅ Incremental mode enabled"))
    if (context) console.log(chalk.white(`   ✅ Context engine: ${context.functionIndex.length} functions indexed`))
    console.log()
  }
}
