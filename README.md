# 🗜️ Comprax

**Intelligent codebase compressor for LLM workflows**

Compress your entire project into organized, LLM-optimized files while preserving debugging context and code structure. Reduce token usage by 25-35% without losing important information.

**New in v2.0:** 🎉 Export detection, stack analysis, and hybrid mode for better LLM understanding!

[![npm version](https://img.shields.io/npm/v/comprax.svg)](https://www.npmjs.com/package/comprax)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)

---

## ✨ Features

### Core Features (v1.0.0)
- 🎯 **Smart Compression** - 25-35% token reduction while preserving context
- 💬 **Comment Preservation** - Keeps TODO, FIXME, BUG, HACK, and debugging notes
- 📁 **Directory Organization** - Automatically organizes by folder structure
- 📄 **Combined Mode** - Option to create single unified file
- 🎛️ **Flexible Filtering** - Exclude/include specific directories and extensions
- 📊 **Detailed Analytics** - Token estimation and compression statistics
- ⚡ **Fast & Efficient** - Processes 50-100 files per second

### New in v2.0 🎉
- 🔍 **Export Detection** - Automatically identifies module exports (ES6 & CommonJS)
- 📦 **Stack Analysis** - Auto-detects frameworks, databases, and libraries
- 🤖 **Hybrid Mode** - Enhanced output with structural metadata for LLMs
- 💡 **Smart Prompts** - Context-aware suggestions for AI analysis
- 📊 **Project Metadata** - Rich headers with framework and stack information

---

## 📦 Installation

### Using npx (No Installation Required)
```bash
npx comprax ./my-project
```

### Global Installation
```bash
npm install -g comprax
```

### With sudo (Linux/Mac)
```bash
sudo npm install -g comprax
```

### Verify Installation
```bash
comprax --version
```

---

## 🚀 Quick Start

### Basic Mode (v1 - Fastest)
```bash
# Compress entire project (creates directory structure)
comprax ./my-project

# Single file output
comprax ./my-project -c -o project.txt
```

### Hybrid Mode (v2 - Best for LLM Analysis) 🆕
```bash
# With export detection and stack analysis
comprax ./my-project --mode hybrid

# Hybrid mode + single file
comprax ./my-project -m hybrid -c -o project.txt

# Hybrid mode + verbose
comprax ./my-project -m hybrid -v
```

---

## ✨ v2.0: Hybrid Mode

### What is Hybrid Mode?

Hybrid mode adds **export detection** and **stack analysis** to help LLMs better understand your codebase structure.

### Quick Example

```bash
# Enable hybrid mode
npx comprax . --mode hybrid

# Or shorter
npx comprax . -m hybrid
```

### What You Get

**1. Export Detection**
```
## src/auth.js
EXPORTS: login, logout, verifyToken
function login(username,password){...}
```

**2. Stack Analysis**
```
======================================================================
PROJECT: my-app
======================================================================
Framework: Next.js
Database: PostgreSQL, Redis
Libraries: Prisma, tRPC, Zod
Total Files: 45
======================================================================
```

**3. Smart Prompts**

A `_prompt.txt` file with context-aware suggestions:
```
## Suggested Analysis Tasks

For Next.js projects:
- Analyze the routing structure and page components
- Review API routes and data fetching patterns
- Check for proper use of Server/Client Components
...
```

### Basic vs Hybrid Mode

| Feature | Basic Mode | Hybrid Mode |
|---------|------------|-------------|
| Compression | ✅ 29% | ✅ 16% |
| Comments preserved | ✅ | ✅ |
| Export detection | ❌ | ✅ |
| Stack analysis | ❌ | ✅ |
| Smart prompts | ❌ | ✅ |
| Speed | Fastest | Fast |
| Token usage | Lower | Slightly higher |
| LLM understanding | Good | Excellent |

### When to Use Each Mode

**Use Basic Mode when:**
- You want fastest compression
- Minimum token usage is critical
- Simple codebase analysis

**Use Hybrid Mode when:**
- Analyzing architecture
- Understanding module relationships
- Getting better LLM insights
- Working with complex codebases

---

## 📖 Usage

```bash
comprax <path> [options]

Arguments:
  path                    Path to project directory or subdirectory

Options:
  -o, --output <path>     Output path (default: "comprax-output")
  -c, --combined          Create single combined file
  -m, --mode <mode>       Compression mode: basic or hybrid (default: basic)
  -e, --exclude <dirs>    Additional directories to exclude
  -i, --include <exts>    File extensions to include
  --verbose               Show detailed processing information
  -h, --help              Display help information
  -v, --version           Display version number

Commands:
  info                    Display project information
  examples                Show usage examples
  stats [path]            Show compression statistics
```

---

## 📚 Examples

### Basic Usage
```bash
# Compress current directory
comprax .

# Compress specific project
comprax ./my-project

# Single file output
comprax ./src -c -o output.txt
```

### Hybrid Mode (v2) 🆕
```bash
# With export detection & stack analysis
comprax . -m hybrid

# Hybrid mode, single file
comprax . -m hybrid -c

# Hybrid mode, verbose
comprax . -m hybrid -v
```

### Filtering
```bash
# Exclude directories
comprax . -e tests docs

# Only TypeScript files
comprax . -i .ts .tsx

# Exclude tests from src
comprax ./src -e __tests__
```

### Real-World Examples
```bash
# Prepare for AI analysis (hybrid mode)
comprax . -m hybrid -c -o analysis.txt

# Code review (basic mode, fast)
comprax ./src -e __tests__ -c -o review.txt

# TypeScript only with stack info
comprax . -m hybrid -i .ts .tsx -o typescript-analysis.txt

# Create timestamped snapshot
comprax . -c -o snapshots/project-$(date +%Y%m%d).txt
```

---

## 📊 Example Output

### Hybrid Mode Output (v2)

**Project Header:**
```
======================================================================
PROJECT: my-app
======================================================================
Framework: Next.js
Database: PostgreSQL
Libraries: Prisma, React Query, Zod
Total Files: 88
======================================================================
```

**File with Exports:**
```
## src/api/auth.js
EXPORTS: login, logout, refreshToken, verifyToken

function login(credentials){
// Login implementation
}

function logout(){
// Logout implementation
}
```

**Smart Prompt File** (`_prompt.txt`):
```
# my-app - Compressed Codebase

I've compressed this codebase for your analysis.

## Project Context

- **Framework:** Next.js
- **Database:** PostgreSQL
- **Key Libraries:** Prisma, React Query, Zod
- **Total Files:** 88

## Suggested Analysis Tasks

**For Next.js projects:**
- Analyze the routing structure and page components
- Review API routes and data fetching patterns
- Check for proper use of Server/Client Components
- Identify performance optimization opportunities

...
```

### Directory Structure Mode
```
comprax-output/
└── my-project/
    ├── _summary.txt           (Project overview)
    ├── _prompt.txt            (Smart prompts - hybrid mode)
    ├── bin.txt
    ├── src_components.txt
    ├── src_utils.txt
    └── ...
```

---

## 📈 Performance & Results

### Real-World Testing

**Basic Mode:**
- **Compression:** 29%
- **Original:** 583.6 KB → **Compressed:** 412.9 KB
- **Token Savings:** ~42,000 tokens

**Hybrid Mode:**
- **Compression:** 16%
- **Original:** 583.6 KB → **Compressed:** 490.9 KB
- **Token Savings:** ~23,739 tokens
- **Extra Features:** Export detection ✅, Stack analysis ✅, Smart prompts ✅

### Why Hybrid Has Lower Compression

Hybrid mode includes additional metadata:
- Export annotations
- Project stack information
- Structured headers
- Enhanced formatting

**Trade-off:** Slightly larger file size, but significantly better LLM comprehension!

---

## 🎯 Use Cases

### 1. AI-Powered Architecture Analysis
```bash
comprax . -m hybrid -c -o architecture.txt
# Upload to Claude/ChatGPT
# Ask: "Analyze the architecture and suggest improvements"
```

### 2. Understanding Module Dependencies
```bash
comprax . -m hybrid
# Hybrid mode shows all exports
# Ask AI: "Explain the relationships between these modules"
```

### 3. Code Reviews with Context
```bash
comprax ./src -m hybrid -e __tests__ -c -o review.txt
# Share with team + AI assistant
```

### 4. Documentation Generation
```bash
comprax . -m hybrid -c -o docs/codebase-snapshot.txt
# AI can generate docs with full context
```

### 5. Bug Investigation
```bash
comprax ./problematic-module -m hybrid -c -o debug.txt
# Upload to AI: "Find potential bugs and explain the data flow"
```

---

## 🛠️ What Gets Compressed

### ✅ Removed (Safe)
- Empty lines
- Excessive whitespace
- Auto-generated comments (eslint-disable, prettier-ignore)
- Redundant comments

### ✅ Preserved (Important)
- All code logic and structure
- TODO, FIXME, BUG, HACK comments
- Function documentation
- Debugging context
- **NEW:** Export declarations (hybrid mode)

### 📁 Default Exclusions
- `node_modules/`
- `.git/`
- `dist/`, `build/`
- `.next/`, `.cache/`
- `coverage/`

---

## 🔧 Integration

### npm Scripts
```json
{
  "scripts": {
    "compress": "comprax .",
    "compress:hybrid": "comprax . -m hybrid",
    "compress:analysis": "comprax . -m hybrid -c -o analysis.txt",
    "compress:review": "comprax ./src -e __tests__ -c -o review.txt"
  }
}
```

### CI/CD Integration

**GitHub Actions:**
```yaml
name: Compress Codebase
on: [push]

jobs:
  compress:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npx comprax . -m hybrid -c -o compressed.txt
      - uses: actions/upload-artifact@v3
        with:
          name: compressed-codebase
          path: compressed.txt
```

---

## ❓ FAQ

### Q: What's the difference between basic and hybrid mode?
**A:** Basic mode focuses on maximum compression. Hybrid mode adds export detection, stack analysis, and better structure for LLM understanding at the cost of slightly lower compression.

### Q: Should I always use hybrid mode?
**A:** Use hybrid mode when working with AI for architecture analysis, documentation, or understanding complex codebases. Use basic mode for simple compression or when token limits are critical.

### Q: Will hybrid mode work with my framework?
**A:** Yes! Hybrid mode auto-detects 40+ frameworks and tools including Next.js, Express, React, Vue, Angular, Prisma, PostgreSQL, MongoDB, and more.

### Q: Does it support CommonJS and ES6 modules?
**A:** Yes! Export detection works with both:
- ES6: `export function`, `export const`, `export default`
- CommonJS: `module.exports`, `exports.name`

### Q: Is v2 backward compatible with v1?
**A:** Completely! All v1 commands work exactly the same. Hybrid mode is opt-in with `--mode hybrid`.

---

## 🗺️ Roadmap

### v1.0.0 ✅
- Smart compression
- Directory organization
- Comment preservation
- Flexible filtering

### v2.0 ✅ (Current)
- Export detection (9 patterns)
- Stack detection (40+ frameworks/tools)
- Hybrid mode
- Smart prompt generation
- Project metadata headers
- ESM dependency updates (v2.0.1)

### Future Development
We're considering these features based on user feedback:
- Additional framework detection (Astro, Qwik, SolidJS)
- More export patterns (dynamic imports, re-exports)
- Multi-language support (Python initially)
- Enhanced compression strategies

**Your feedback shapes our roadmap!**

---

## 📄 License

MIT © Ajay Thorat

---

## 🔗 Links

- **npm:** https://www.npmjs.com/package/comprax
- **GitHub:** https://github.com/AjayBThorat-20/comprax
- **Issues:** https://github.com/AjayBThorat-20/comprax/issues
- **Changelog:** [CHANGELOG.md](CHANGELOG.md)
- **Migration Guide:** [MIGRATION.md](MIGRATION.md)

---

## 💖 Support

If Comprax helps you, please:
- ⭐ Star the repo on GitHub
- 📢 Share it with your team
- 🐛 Report bugs
- 💡 Suggest features
- 💬 Share your use cases

---

**Made with ❤️ by [Ajay Thorat](https://github.com/AjayBThorat-20)**

---

*Updated for v2.0.0 - May 2026*