#!/usr/bin/env node

import { Command } from "commander"
import { run } from "../src/index.js"
import chalk from "chalk"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
  .option("-m, --mode <mode>", "compression mode: basic or hybrid (default: basic)", "basic")
  .option("--verbose", "show detailed processing info", false)
  .option("-e, --exclude <dirs...>", "additional directories to exclude (space-separated)")
  .option("-i, --include <exts...>", "file extensions to include (space-separated)")
  .helpOption('-h, --help', 'Display help information')
  .addHelpText('after', `

Examples:
  $ comprax .                           Compress current directory
  $ comprax ./my-project                Compress specific project
  $ comprax ./src -c -o output.txt      Single file output
  $ comprax . -m hybrid                 Hybrid mode with exports & stack detection
  $ comprax . -m hybrid -c              Hybrid mode, single file
  $ comprax . -e tests docs             Exclude directories
  $ comprax . -i .ts .tsx               Only TypeScript files
  $ comprax . --verbose                 Show detailed progress

Modes:
  basic   - Simple compression (default)
  hybrid  - With export detection & stack analysis (v2)

Documentation:
  GitHub: https://github.com/AjayBThorat-20/comprax
  Issues: https://github.com/AjayBThorat-20/comprax/issues
  `)
  .action(async (projectPath, options) => {
    // Validate mode
    if (options.mode && !['basic', 'hybrid'].includes(options.mode)) {
      console.error(chalk.red(`\n❌ Invalid mode: ${options.mode}`))
      console.log(chalk.yellow('Valid modes: basic, hybrid\n'))
      process.exit(1)
    }

    try {
      console.log(chalk.cyan.bold("\n🚀 Comprax v" + packageJson.version + "\n"))
      if (options.mode === 'hybrid') {
        console.log(chalk.blue("📊 Mode: Hybrid (with export detection & stack analysis)\n"))
      }
      await run(projectPath, options)
    } catch (err) {
      console.error(chalk.red.bold("\n❌ Error:"), err.message)
      if (options.verbose) {
        console.error(chalk.red(err.stack))
      }
      process.exit(1)
    }
  })

// Info command
program
  .command('info')
  .description('Display project information and statistics')
  .action(() => {
    console.log(chalk.cyan.bold('\n📦 Comprax - Codebase Compressor\n'))
    console.log(chalk.white('Version:'), chalk.green(packageJson.version))
    console.log(chalk.white('Description:'), packageJson.description)
    console.log(chalk.white('Author:'), packageJson.author)
    console.log(chalk.white('License:'), packageJson.license)
    console.log()
    console.log(chalk.yellow('New in v2.0.0:'))
    console.log('  ✨ Export detection')
    console.log('  ✨ Stack analysis')
    console.log('  ✨ Hybrid mode')
    console.log('  ✨ Smart prompt generation')
    console.log()
  })

// Examples command
program
  .command('examples')
  .description('Show usage examples')
  .action(() => {
    console.log(chalk.cyan.bold('\n📚 Comprax Examples\n'))
    
    console.log(chalk.yellow('Basic Usage:'))
    console.log('  comprax .                     # Compress current directory')
    console.log('  comprax ./my-project          # Compress specific project')
    console.log()
    
    console.log(chalk.yellow('Hybrid Mode (v2):'))
    console.log('  comprax . -m hybrid           # With export detection & stack analysis')
    console.log('  comprax . -m hybrid -c        # Hybrid mode, single file')
    console.log('  comprax . -m hybrid -v        # Hybrid mode, verbose')
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
  })

// Stats command
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

program.parse()
