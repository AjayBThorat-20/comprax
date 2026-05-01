#!/usr/bin/env node

import { Command } from "commander"
import { run } from "../src/index.js"
import chalk from "chalk"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Read package.json for version
const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../package.json'), 'utf-8')
)

const program = new Command()

program
  .name("comprax")
  .description("Compress codebase for LLM usage - Reduce tokens by 25-35%")
  .version(packageJson.version, '-v, --version', 'Display version number')
  .argument("<path>", "path to project directory or specific subdirectory")
  .option("-o, --output <path>", "output path (directory for split mode, file for combined)", "comprax-output")
  .option("-c, --combined", "create single combined file instead of directory structure", false)
  .option("--verbose", "show detailed processing info", false)
  .option("-e, --exclude <dirs...>", "additional directories to exclude (space-separated)")
  .option("-i, --include <exts...>", "file extensions to include (space-separated)")
  .helpOption('-h, --help', 'Display help information')
  .addHelpText('after', `

Examples:
  $ comprax .                           Compress current directory
  $ comprax ./my-project                Compress specific project
  $ comprax ./src -c -o output.txt      Single file output
  $ comprax . -e tests docs             Exclude directories
  $ comprax . -i .ts .tsx               Only TypeScript files
  $ comprax . --verbose                 Show detailed progress

Documentation:
  GitHub: https://github.com/AjayBThorat-20/comprax
  Issues: https://github.com/AjayBThorat-20/comprax/issues
  `)
  .action(async (projectPath, options) => {
    try {
      console.log(chalk.cyan.bold("\n🚀 Comprax v" + packageJson.version + "\n"))
      await run(projectPath, options)
    } catch (err) {
      console.error(chalk.red.bold("\n❌ Error:"), err.message)
      if (options.verbose) {
        console.error(chalk.red(err.stack))
      }
      process.exit(1)
    }
  })

// Add info command
program
  .command('info')
  .description('Display project information and statistics')
  .action(() => {
    console.log(chalk.cyan.bold('\n📦 Comprax - Codebase Compressor\n'))
    console.log(chalk.white('Version:'), chalk.green(packageJson.version))
    console.log(chalk.white('Description:'), packageJson.description)
    console.log(chalk.white('Author:'), packageJson.author)
    console.log(chalk.white('License:'), packageJson.license)
    console.log(chalk.white('Repository:'), packageJson.repository?.url || 'N/A')
    console.log()
  })

// Add examples command
program
  .command('examples')
  .description('Show usage examples')
  .action(() => {
    console.log(chalk.cyan.bold('\n📚 Comprax Examples\n'))
    
    console.log(chalk.yellow('Basic Usage:'))
    console.log('  comprax .                     # Compress current directory')
    console.log('  comprax ./my-project          # Compress specific project')
    console.log()
    
    console.log(chalk.yellow('Output Modes:'))
    console.log('  comprax . -c                  # Single combined file')
    console.log('  comprax . -o custom-output    # Custom output directory')
    console.log('  comprax . -c -o file.txt      # Single file with custom name')
    console.log()
    
    console.log(chalk.yellow('Filtering:'))
    console.log('  comprax . -e tests docs       # Exclude directories')
    console.log('  comprax . -i .ts .tsx         # Only TypeScript')
    console.log('  comprax ./src -e __tests__    # Exclude tests from src')
    console.log()
    
    console.log(chalk.yellow('Advanced:'))
    console.log('  comprax . --verbose           # Show detailed progress')
    console.log('  comprax . -e node_modules dist build')
    console.log('  comprax ./src -i .js .jsx -c -o review.txt')
    console.log()
  })

// Add stats command (for existing output)
program
  .command('stats [path]')
  .description('Show statistics for compressed output')
  .action((outputPath = 'comprax-output') => {
    try {
      if (!fs.existsSync(outputPath)) {
        console.log(chalk.red(`\n❌ Output not found: ${outputPath}\n`))
        console.log(chalk.yellow('Run comprax first to create output\n'))
        return
      }

      const stats = fs.statSync(outputPath)
      
      if (stats.isDirectory()) {
        // Count files in directory
        const files = fs.readdirSync(outputPath, { recursive: true })
          .filter(f => {
            const fullPath = path.join(outputPath, f)
            return fs.statSync(fullPath).isFile()
          })
        
        let totalSize = 0
        files.forEach(f => {
          const fullPath = path.join(outputPath, f)
          totalSize += fs.statSync(fullPath).size
        })
        
        console.log(chalk.cyan.bold('\n📊 Compression Statistics\n'))
        console.log(chalk.white('Output Directory:'), chalk.green(outputPath))
        console.log(chalk.white('Total Files:'), chalk.green(files.length))
        console.log(chalk.white('Total Size:'), chalk.green(formatBytes(totalSize)))
        console.log()
      } else {
        console.log(chalk.cyan.bold('\n📊 File Statistics\n'))
        console.log(chalk.white('File:'), chalk.green(outputPath))
        console.log(chalk.white('Size:'), chalk.green(formatBytes(stats.size)))
        console.log()
      }
    } catch (err) {
      console.error(chalk.red('\n❌ Error reading stats:'), err.message)
      console.log()
    }
  })

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

// Parse arguments
program.parse()
