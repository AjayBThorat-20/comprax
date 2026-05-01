import path from "path"
import { formatExports } from "./export-detector.js"
import { formatStack } from "./stack-detector.js"

/**
 * Format files for a single directory (basic mode)
 */
export function formatDirectory(files, dirName) {
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

/**
 * Format all files combined (basic mode)
 */
export function formatCombined(files, projectPath) {
  const sections = files.map(f => {
    const relativePath = path.relative(projectPath, f.path)
    return `## ${relativePath}\n${f.code}`
  })
  
  return sections.join('\n\n')
}

/**
 * Format combined with hybrid mode (v2)
 */
export function formatCombinedHybrid(files, projectPath, stack, projectName) {
  let output = ''
  
  // Add header with project context
  output += '='.repeat(70) + '\n'
  output += `PROJECT: ${projectName}\n`
  output += '='.repeat(70) + '\n'
  output += formatStack(stack) + '\n'
  output += `Total Files: ${files.length}\n`
  output += '='.repeat(70) + '\n\n'
  
  // Add files with export info
  const sections = files.map(f => {
    const relativePath = path.relative(projectPath, f.path)
    let section = `## ${relativePath}\n`
    
    // Add exports if available
    if (f.exports && f.exports.length > 0) {
      const exportStr = formatExports(f.exports)
      if (exportStr) {
        section += `EXPORTS: ${exportStr}\n`
      }
    }
    
    section += f.code
    
    return section
  })
  
  output += sections.join('\n\n')
  
  return output
}

/**
 * Format directory with hybrid mode (v2)
 */
export function formatDirectoryHybrid(files, dirName) {
  const header = [
    '='.repeat(70),
    `DIRECTORY: ${dirName}`,
    `FILES: ${files.length}`,
    '='.repeat(70),
    ''
  ].join('\n')
  
  const sections = files.map(f => {
    const filename = path.basename(f.relativePath)
    let section = `## ${filename}\n`
    
    // Add exports if available
    if (f.exports && f.exports.length > 0) {
      const exportStr = formatExports(f.exports)
      if (exportStr) {
        section += `EXPORTS: ${exportStr}\n`
      }
    }
    
    section += f.code
    
    return section
  })
  
  return header + sections.join('\n\n')
}

/**
 * Create summary file
 */
export function formatSummary(organized, stats, stack, projectName) {
  const lines = []
  
  lines.push('='.repeat(70))
  lines.push('COMPRAX COMPRESSION SUMMARY')
  lines.push('='.repeat(70))
  lines.push('')
  lines.push(`Project: ${projectName}`)
  lines.push(`Generated: ${new Date().toISOString()}`)
  lines.push(`Total Files: ${stats.totalFiles}`)
  lines.push(`Total Directories: ${organized.size}`)
  lines.push(`Original Size: ${formatBytes(stats.originalSize)}`)
  lines.push(`Compressed Size: ${formatBytes(stats.compressedSize)}`)
  lines.push(`Reduction: ${stats.savedPercent}%`)
  lines.push('')
  
  // Add stack info if available
  if (stack) {
    lines.push('='.repeat(70))
    lines.push('PROJECT STACK')
    lines.push('='.repeat(70))
    lines.push(formatStack(stack))
    lines.push('')
  }
  
  lines.push('='.repeat(70))
  lines.push('DIRECTORY BREAKDOWN')
  lines.push('='.repeat(70))
  lines.push('')
  
  // Sort directories
  const dirs = Array.from(organized.keys()).sort()
  
  for (const dir of dirs) {
    const files = organized.get(dir)
    const totalSize = files.reduce((sum, f) => sum + f.code.length, 0)
    lines.push(`📁 ${dir}`)
    lines.push(`   Files: ${files.length}`)
    lines.push(`   Size: ${formatBytes(totalSize)}`)
    lines.push('')
  }
  
  return lines.join('\n')
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + " B"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  return (bytes / (1024 * 1024)).toFixed(1) + " MB"
}
