import chalk from "chalk"
import { formatBytes, estimateTokens } from "./token-estimator.js"

/**
 * Print comprehensive compression statistics
 */
export function printStats(stats) {
  const originalTokens = estimateTokens(stats.originalSize)
  const compressedTokens = estimateTokens(stats.compressedSize)
  const savedTokens = originalTokens - compressedTokens

  console.log("\n" + "=".repeat(60))
  console.log(chalk.cyan.bold("📊 COMPRESSION SUMMARY"))
  console.log("=".repeat(60))
  
  console.log(chalk.white(`Files processed: ${chalk.green.bold(stats.totalFiles)}`))
  
  if (stats.skippedFiles > 0) {
    console.log(chalk.yellow(`Files skipped: ${stats.skippedFiles}`))
  }
  
  console.log(chalk.white(`Original size: ${chalk.blue(formatBytes(stats.originalSize))}`))
  console.log(chalk.white(`Compressed size: ${chalk.blue(formatBytes(stats.compressedSize))}`))
  console.log(chalk.white(`Size reduction: ${chalk.green.bold(stats.savedPercent + "%")}`))
  
  console.log("\n" + chalk.cyan("Token Estimation:"))
  console.log(chalk.white(`  Before: ~${chalk.blue(originalTokens.toLocaleString())} tokens`))
  console.log(chalk.white(`  After: ~${chalk.blue(compressedTokens.toLocaleString())} tokens`))
  console.log(chalk.white(`  Saved: ~${chalk.green.bold(savedTokens.toLocaleString())} tokens`))
  
  console.log("=".repeat(60) + "\n")
  
  console.log(chalk.green("💡 Next steps:"))
  console.log(chalk.white("  1. Open ChatGPT or Claude"))
  console.log(chalk.white("  2. Upload or paste comprax-output.txt"))
  console.log(chalk.white("  3. Ask questions about your codebase"))
  console.log()
}