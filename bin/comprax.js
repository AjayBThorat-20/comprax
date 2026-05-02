#!/usr/bin/env node

import { Command } from "commander"
import chalk from "chalk"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { run } from "../src/index.js"

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
  .option("--semantic", "include semantic summaries (AST-based)", false)
  .option("--smart", "enable smart filtering (skip low-importance files)", false)
  .option("--threshold <number>", "importance threshold for smart mode (default: 5)", "5")
  .option("--incremental", "only process changed files (uses cache)", false)
  .option("--top <number>", "include only top N most important files")
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
  $ comprax . --semantic                With semantic summaries (v2.0.2)
  $ comprax . --semantic --smart        Smart filtering + summaries
  $ comprax . --incremental             Only compress changed files
  $ comprax . --top 20                  Only top 20 most important files
  $ comprax . -e tests docs             Exclude directories
  $ comprax . -i .ts .tsx               Only TypeScript files
  $ comprax . --verbose                 Show detailed progress

Modes:
  basic      - Simple compression (default)
  hybrid     - With export detection & stack analysis (v2.0)

v2.0.2 Features:
  --semantic     - AST-based semantic summaries
  --smart        - Intelligent file filtering by importance
  --incremental  - Cache-based, only process changes
  --top N        - Include only N most important files

Documentation:
  GitHub: https://github.com/AjayBThorat-20/comprax
  Issues: https://github.com/AjayBThorat-20/comprax/issues
  `)
  .action(async (projectPath, options) => {
    if (options.mode && !['basic', 'hybrid'].includes(options.mode)) {
      console.error(chalk.red(`\n❌ Invalid mode: ${options.mode}`))
      console.log(chalk.yellow('Valid modes: basic, hybrid\n'))
      process.exit(1)
    }

    if (options.threshold) {
      options.threshold = parseInt(options.threshold, 10)
      if (isNaN(options.threshold)) {
        console.error(chalk.red('\n❌ Invalid threshold: must be a number\n'))
        process.exit(1)
      }
    }

    if (options.top) {
      options.top = parseInt(options.top, 10)
      if (isNaN(options.top) || options.top < 1) {
        console.error(chalk.red('\n❌ Invalid top: must be a positive number\n'))
        process.exit(1)
      }
    }

    try {
      console.log(chalk.cyan.bold("\n🚀 Comprax v" + packageJson.version + "\n"))
      
      if (options.mode === 'hybrid') {
        console.log(chalk.blue("📊 Mode: Hybrid (with export detection & stack analysis)"))
      }
      if (options.semantic) {
        console.log(chalk.blue("🧠 Semantic: AST-based summaries enabled"))
      }
      if (options.smart) {
        console.log(chalk.blue(`🎯 Smart: Filtering by importance (threshold: ${options.threshold || 5})`))
      }
      if (options.incremental) {
        console.log(chalk.blue("⚡ Incremental: Cache-based processing"))
      }
      if (options.top) {
        console.log(chalk.blue(`🔝 Top: Including only ${options.top} most important files`))
      }
      console.log()
      
      await run(projectPath, options)
    } catch (err) {
      console.error(chalk.red.bold("\n❌ Error:"), err.message)
      if (options.verbose) {
        console.error(chalk.red(err.stack))
      }
      process.exit(1)
    }
  })

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
    console.log(chalk.yellow('Features in v2.0:'))
    console.log('  ✨ Export detection')
    console.log('  ✨ Stack analysis')
    console.log('  ✨ Hybrid mode')
    console.log('  ✨ Smart prompt generation')
    console.log()
    console.log(chalk.yellow('New in v2.0.2:'))
    console.log('  🧠 Semantic summaries (AST-based)')
    console.log('  🎯 Smart filtering by importance')
    console.log('  ⚡ Incremental processing')
    console.log('  🔝 Top N file selection')
    console.log()
  })

program
  .command('examples')
  .description('Show usage examples')
  .action(() => {
    console.log(chalk.cyan.bold('\n📚 Comprax Examples\n'))
    
    console.log(chalk.yellow('Basic Usage:'))
    console.log('  comprax .                     # Compress current directory')
    console.log('  comprax ./my-project          # Compress specific project')
    console.log()
    
    console.log(chalk.yellow('Hybrid Mode (v2.0):'))
    console.log('  comprax . -m hybrid           # With export detection & stack analysis')
    console.log('  comprax . -m hybrid -c        # Hybrid mode, single file')
    console.log('  comprax . -m hybrid -v        # Hybrid mode, verbose')
    console.log()
    
    console.log(chalk.yellow('Semantic Mode (v2.0.2):'))
    console.log('  comprax . --semantic          # AST-based summaries')
    console.log('  comprax . --semantic -c       # Semantic, single file')
    console.log('  comprax . -m hybrid --semantic # Hybrid + semantic')
    console.log()
    
    console.log(chalk.yellow('Smart Filtering (v2.0.2):'))
    console.log('  comprax . --smart             # Skip low-importance files')
    console.log('  comprax . --smart --threshold 10  # Custom threshold')
    console.log('  comprax . --top 20            # Only top 20 files')
    console.log()
    
    console.log(chalk.yellow('Incremental Mode (v2.0.2):'))
    console.log('  comprax . --incremental       # Only process changed files')
    console.log('  comprax . --incremental -v    # With verbose output')
    console.log()
    
    console.log(chalk.yellow('Combined Features:'))
    console.log('  comprax . --semantic --smart --top 30')
    console.log('  comprax . -m hybrid --semantic --incremental')
    console.log('  comprax . --smart --threshold 8 -c -o analysis.txt')
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