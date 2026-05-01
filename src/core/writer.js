import fs from "fs"
import chalk from "chalk"

/**
 * Write compressed output to file
 */
export function writeOutput(content, filename = "comprax-output.txt") {
  try {
    fs.writeFileSync(filename, content, "utf-8")
    return true
  } catch (err) {
    console.error(chalk.red(`❌ Failed to write output:`), err.message)
    throw err
  }
}