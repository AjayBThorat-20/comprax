import chalk from "chalk"
import ora from "ora"

let spinner

/**
 * Start progress spinner
 */
export function startSpinner(text) {
  spinner = ora({
    text: chalk.cyan(text),
    color: "cyan"
  }).start()
}

/**
 * Update spinner text
 */
export function updateSpinner(text) {
  if (spinner) {
    spinner.text = chalk.cyan(text)
  }
}

/**
 * Stop spinner with success
 */
export function succeedSpinner(text) {
  if (spinner) {
    spinner.succeed(chalk.green(text))
  }
}

/**
 * Stop spinner with failure
 */
export function failSpinner(text) {
  if (spinner) {
    spinner.fail(chalk.red(text))
  }
}

/**
 * Log info message
 */
export function logInfo(message) {
  console.log(chalk.blue("ℹ"), chalk.white(message))
}

/**
 * Log warning message
 */
export function logWarning(message) {
  console.log(chalk.yellow("⚠"), chalk.yellow(message))
}

/**
 * Log error message
 */
export function logError(message) {
  console.log(chalk.red("✖"), chalk.red(message))
}