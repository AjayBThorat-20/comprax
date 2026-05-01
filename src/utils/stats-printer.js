import chalk from "chalk"

export function printStats(stats) {
  console.log()
  console.log(chalk.cyan("=".repeat(60)))
  console.log(chalk.cyan.bold("📊 COMPRESSION SUMMARY"))
  console.log(chalk.cyan("=".repeat(60)))
  console.log(chalk.white("Files processed:"), chalk.green(stats.totalFiles))
  if (stats.skippedFiles > 0) {
    console.log(chalk.white("Files skipped:"), chalk.yellow(stats.skippedFiles))
  }
  console.log(chalk.white("Original size:"), chalk.yellow(formatBytes(stats.originalSize)))
  console.log(chalk.white("Compressed size:"), chalk.green(formatBytes(stats.compressedSize)))
  console.log(chalk.white("Size reduction:"), chalk.cyan(`${stats.savedPercent}%`))
  
  const tokensBefore = Math.floor(stats.originalSize / 3.9)
  const tokensAfter = Math.floor(stats.compressedSize / 3.9)
  const tokensSaved = tokensBefore - tokensAfter
  
  console.log()
  console.log(chalk.white("Token Estimation:"))
  console.log(chalk.white("  Before:"), chalk.yellow(`~${tokensBefore.toLocaleString()} tokens`))
  console.log(chalk.white("  After:"), chalk.green(`~${tokensAfter.toLocaleString()} tokens`))
  console.log(chalk.white("  Saved:"), chalk.cyan(`~${tokensSaved.toLocaleString()} tokens`))
  console.log(chalk.cyan("=".repeat(60)))
  console.log()
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + " B"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  return (bytes / (1024 * 1024)).toFixed(1) + " MB"
}
