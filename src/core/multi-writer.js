import fs from "fs"
import path from "path"
import { getSafeFilename } from "./organizer.js"

/**
 * Write organized files to directory structure
 */
export function writeOrganized(organized, outputBase, projectName, summaryContent) {
  // Create output directory: comprax-output/projectName/
  const outputDir = path.join(outputBase, projectName)
  
  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true })
  }
  
  fs.mkdirSync(outputDir, { recursive: true })
  
  let filesWritten = 0
  
  // Write each directory as a separate .txt file
  for (const [dir, files] of organized.entries()) {
    const filename = getSafeFilename(dir)
    const filepath = path.join(outputDir, filename)
    
    // Format content
    const content = formatDirectoryFile(files, dir)
    
    fs.writeFileSync(filepath, content, 'utf-8')
    filesWritten++
  }
  
  // Write summary
  const summaryPath = path.join(outputDir, '_summary.txt')
  fs.writeFileSync(summaryPath, summaryContent, 'utf-8')
  filesWritten++
  
  return {
    mainDir: path.relative(process.cwd(), outputDir),
    filesWritten
  }
}

function formatDirectoryFile(files, dirName) {
  const header = [
    '='.repeat(70),
    `DIRECTORY: ${dirName}`,
    `FILES: ${files.length}`,
    '='.repeat(70),
    ''
  ].join('\n')
  
  const sections = files.map(f => {
    const filename = path.basename(f.relativePath)
    return `## ${filename}\n${f.code}`
  })
  
  return header + sections.join('\n\n')
}
