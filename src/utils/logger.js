import ora from "ora"
import chalk from "chalk"

let spinner = null

export function startSpinner(text) {
  spinner = ora(text).start()
}

export function succeedSpinner(text) {
  if (spinner) {
    spinner.succeed(text)
    spinner = null
  }
}

export function updateSpinner(text) {
  if (spinner) {
    spinner.text = text
  }
}

export function failSpinner(text) {
  if (spinner) {
    spinner.fail(text)
    spinner = null
  }
}

export function logInfo(message) {
  console.log(chalk.blue(`ℹ ${message}`))
}

export function logSuccess(message) {
  console.log(chalk.green(`✔ ${message}`))
}

export function logWarning(message) {
  console.log(chalk.yellow(`⚠ ${message}`))
}

export function logError(message) {
  console.log(chalk.red(`✖ ${message}`))
}
