# 🗜️ Comprax

**Intelligent codebase compressor for LLM workflows**

Compress your entire project into organized, LLM-optimized files while preserving debugging context and code structure. Reduce token usage by 25-35% without losing important information.

[![npm version](https://img.shields.io/npm/v/comprax.svg)](https://www.npmjs.com/package/comprax)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)

---

## ✨ Features

- 🎯 **Smart Compression** - 25-35% token reduction while preserving context
- 💬 **Comment Preservation** - Keeps TODO, FIXME, BUG, HACK, and debugging notes
- 📁 **Directory Organization** - Automatically organizes by folder structure
- 📄 **Combined Mode** - Option to create single unified file
- 🎛️ **Flexible Filtering** - Exclude/include specific directories and extensions
- 📊 **Detailed Analytics** - Token estimation and compression statistics
- 🚀 **Production Tested** - Successfully handles 88+ file projects
- ⚡ **Fast & Efficient** - Processes 50-100 files per second

---

## 📦 Installation

### Global Installation (Recommended)

```bash
npm install -g comprax
```

### Local Installation

```bash
npm install --save-dev comprax
```

### Verify Installation

```bash
comprax --version
```

---

## 🚀 Quick Start

### Basic Usage

```bash
# Compress entire project (creates directory structure)
comprax ./my-project

# Output:
# comprax-output/
# └── my-project/
#     ├── _summary.txt
#     ├── src_components.txt
#     ├── src_utils.txt
#     └── ...
```

### Single File Mode

```bash
# Create one combined file
comprax ./my-project -c -o project.txt
```

### Compress Specific Directory

```bash
# Only compress src folder
comprax ./my-project/src
```

---

## 📖 Usage

```bash
comprax <path> [options]

Arguments:
  path                    Path to project directory or subdirectory

Options:
  -o, --output <path>     Output path (default: "comprax-output")
  -c, --combined          Create single combined file instead of directory structure
  -e, --exclude <dirs>    Additional directories to exclude (space-separated)
  -i, --include <exts>    File extensions to include (space-separated)
  -v, --verbose           Show detailed processing information
  -h, --help              Display help information
  -V, --version           Display version number
```

---

## 📚 Examples

### Exclude Directories

```bash
# Skip tests, docs, and temp folders
comprax ./my-project -e tests docs temp
```

### Include Only Specific Extensions

```bash
# Process only TypeScript files
comprax ./my-project -i .ts .tsx

# Process only JavaScript files
comprax ./my-project -i .js .jsx .mjs
```

### Combine Multiple Options

```bash
# TypeScript only, exclude tests, single file, verbose
comprax ./my-project -i .ts .tsx -e __tests__ -c -o typescript.txt -v
```

### Real-World Examples

```bash
# Prepare for code review
comprax ./src -e __tests__ -o review.txt -v

# Analyze with ChatGPT/Claude
comprax . -c -o analysis.txt

# Create timestamped snapshot
comprax . -c -o snapshots/project-$(date +%Y%m%d).txt

# Compress only backend code
comprax ./server -i .js .ts -e node_modules
```

---

## 📊 Example Output

### Directory Structure Mode (Default)

```
comprax-output/
└── my-project/
    ├── _summary.txt           (Project overview and statistics)
    ├── bin.txt                (Files from bin/ directory)
    ├── src_components.txt     (Files from src/components/)
    ├── src_utils.txt          (Files from src/utils/)
    ├── src_api.txt            (Files from src/api/)
    └── ...
```

**Summary File Example:**
```
======================================================================
COMPRAX COMPRESSION SUMMARY
======================================================================

Generated: 2026-05-01T14:15:32.016Z
Total Files: 88
Total Directories: 14
Original Size: 583.6 KB
Compressed Size: 412.9 KB
Reduction: 29%

======================================================================
DIRECTORY BREAKDOWN
======================================================================

📁 src/components
   Files: 15
   Size: 85.2 KB

📁 src/utils
   Files: 12
   Size: 42.1 KB
   
...
```

### Combined Mode Output

```
## src/auth.js
// User authentication module
// TODO: Add rate limiting
function login(username,password){
if(!username||!password){
throw new Error("Missing credentials")
}
...
}

## src/utils/helpers.js
// Helper functions
function formatDate(date){
return date.toISOString()
}
...
```

---

## 🎯 Use Cases

### 1. **LLM Context Preparation**
Prepare entire codebases for ChatGPT, Claude, or other LLMs:
```bash
comprax ./my-app -v
# Upload comprax-output/ files to LLM
# Ask: "Explain the architecture of this project"
```

### 2. **Code Reviews**
Share compressed codebase for review:
```bash
comprax ./src -e __tests__ -c -o review.txt
# Share review.txt with team
```

### 3. **Documentation**
Generate organized code snapshots:
```bash
comprax . -c -o docs/codebase-$(date +%Y%m%d).txt
```

### 4. **Architecture Analysis**
Analyze system design with AI:
```bash
comprax . -v
# Upload to Claude: "Analyze the architecture and suggest improvements"
```

### 5. **Bug Investigation**
Focus AI on specific modules:
```bash
comprax ./src/problematic-module -c -o debug.txt
# Upload to ChatGPT: "Find potential bugs in this code"
```

---

## 📈 Performance & Results

### Real-World Testing

**Project:** DevCompass (npm dependency analyzer)
- **Files:** 88 JavaScript files
- **Original Size:** 583.6 KB
- **Compressed Size:** 412.9 KB
- **Reduction:** 29% (170 KB saved)
- **Token Savings:** ~42,000 tokens
- **Comments:** All preserved (TODO, FIXME, BUG)
- **Processing Time:** <2 seconds

### Compression Statistics

| Project Size | Avg. Compression | Token Savings |
|--------------|------------------|---------------|
| Small (10-20 files) | 15-25% | 5,000-15,000 |
| Medium (50-100 files) | 25-35% | 30,000-60,000 |
| Large (200+ files) | 30-40% | 80,000-150,000 |

---

## 🛠️ What Gets Compressed

### ✅ Removed (Safe)
- Empty lines
- Excessive whitespace
- Auto-generated comments (eslint-disable, prettier-ignore, etc.)
- Redundant comments ("End of file", "Constructor", etc.)

### ✅ Preserved (Important)
- All code logic and structure
- TODO, FIXME, BUG, HACK comments
- Important warnings and notes
- Function documentation
- Debugging context
- Security notes

### 📁 Default Exclusions
- `node_modules/`
- `.git/`
- `dist/`, `build/`
- `.next/`, `.cache/`
- `coverage/`
- Binary files
- Lock files

---

## 🔧 Integration

### npm Scripts

Add to your `package.json`:

```json
{
  "scripts": {
    "compress": "comprax .",
    "compress:src": "comprax ./src -e __tests__",
    "compress:single": "comprax . -c -o project.txt",
    "compress:review": "comprax ./src -c -o review.txt -v"
  }
}
```

Usage:
```bash
npm run compress
npm run compress:review
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
      - run: npm install -g comprax
      - run: comprax . -c -o compressed.txt
      - uses: actions/upload-artifact@v3
        with:
          name: compressed-codebase
          path: compressed.txt
```

---

## ❓ FAQ

### Q: Will this break my code?
**A:** No! Comprax only removes whitespace and comments. Your code logic remains 100% intact and functional.

### Q: What about comments? Don't I need them?
**A:** Yes! Comprax preserves all important comments (TODO, FIXME, BUG, HACK, IMPORTANT, etc.) while removing only redundant ones.

### Q: How much space will I save?
**A:** Typically 25-35% compression. A 500KB project becomes ~350KB.

### Q: Can I use this with ChatGPT/Claude?
**A:** Absolutely! That's the primary use case. Upload the compressed files to get better results within token limits.

### Q: Does it work with TypeScript?
**A:** Yes! Supports `.js`, `.ts`, `.jsx`, `.tsx`, `.mjs`, `.cjs`

### Q: What about large projects?
**A:** Comprax handles large projects well. Files >5MB are automatically skipped with warnings.

### Q: Is my code secure?
**A:** Comprax runs locally. Nothing is uploaded or shared. Your code stays on your machine.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup

```bash
# Clone repo
git clone https://github.com/AjayBThorat-20/comprax.git
cd comprax

# Install dependencies
npm install

# Run tests
npm test

# Test locally
node bin/comprax.js ./test-project
```

### Reporting Issues

Found a bug? Have a feature request? 
[Open an issue](https://github.com/AjayBThorat-20/comprax/issues)

---

## 🗺️ Roadmap

### v1.0.0 (Current) ✅
- Smart compression
- Directory organization
- Comment preservation
- Flexible filtering

### v2.0.0 (Planned)
- Export detection
- Stack detection (framework identification)
- Project metadata headers
- Compression level options
- Incremental compression

### v3.0.0 (Future)
- Multi-language support (Python, Java, Go)
- Custom compression rules
- API integration
- Plugin system

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

---

**Made with ❤️ by [Ajay Thorat](https://github.com/AjayBThorat-20)**

---

*Last updated: May 2026*
