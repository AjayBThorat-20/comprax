# 🗜️ Comprax

**Intelligent codebase compressor for LLM workflows with AST-based semantic analysis**

Compress your entire project into organized, LLM-optimized files while preserving debugging context and code structure. Achieve up to **98% token reduction** with semantic mode while maintaining full architectural understanding.

**New in v2.0.2:** 🚀 AST-based semantic analysis, smart filtering, incremental caching, and 96-98% token reduction!

[![npm version](https://img.shields.io/npm/v/comprax.svg)](https://www.npmjs.com/package/comprax)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)

---

## ✨ Features

### Core Features (v1.0)
- 🎯 **Smart Compression** - 20-30% token reduction while preserving context
- 💬 **Comment Preservation** - Keeps TODO, FIXME, BUG, HACK, and debugging notes
- 📁 **Directory Organization** - Automatically organizes by folder structure
- 📄 **Combined Mode** - Option to create single unified file
- 🎛️ **Flexible Filtering** - Exclude/include specific directories and extensions
- 📊 **Detailed Analytics** - Token estimation and compression statistics
- ⚡ **Fast & Efficient** - Processes 50-100 files per second

### Enhanced in v2.0 🎉
- 🔍 **Export Detection** - Automatically identifies module exports (ES6 & CommonJS)
- 📦 **Stack Analysis** - Auto-detects frameworks, databases, and libraries
- 🤖 **Hybrid Mode** - Enhanced output with structural metadata for LLMs
- 💡 **Smart Prompts** - Context-aware suggestions for AI analysis
- 📊 **Project Metadata** - Rich headers with framework and stack information

### Revolutionary in v2.0.2 🚀
- 🧠 **Semantic Analysis** - AST-based code structure extraction
- 🎯 **Smart Filtering** - Importance-based file filtering
- 🔝 **Top-N Selection** - Include only the most important files
- ⚡ **Incremental Mode** - Cache-based processing (10x faster on re-runs)
- 📉 **98% Token Reduction** - Massive savings with semantic summaries
- 🔄 **Dual Module Support** - Full CommonJS + ESM compatibility

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
# Should show: 2.0.2
```

---

## 🚀 Quick Start

### Basic Mode (Fast Compression)
```bash
# Compress entire project
comprax ./my-project

# Single file output
comprax ./my-project -c -o project.txt
```

### Semantic Mode (Maximum Token Reduction) 🆕
```bash
# 96-98% token reduction with summaries
comprax ./my-project --semantic -c -o analysis.txt

# Works great for large codebases
comprax . --semantic --smart --top 30 -c -o important-files.txt
```

### Ultimate Mode (All Features) 🔥
```bash
# Hybrid + Semantic + Smart filtering + Top files
comprax . -m hybrid --semantic --smart --top 25 -c -o ultimate.txt
```

---

## 🎯 Mode Comparison

| Mode | Token Reduction | Use Case | Speed |
|------|----------------|----------|-------|
| **Basic** | 20% | Quick compression | ⚡⚡⚡ |
| **Hybrid** | 16% | Better LLM understanding | ⚡⚡ |
| **Semantic** | **96%** | Architecture analysis | ⚡⚡ |
| **Ultimate** | **98%** | Deep analysis, top files only | ⚡ |

### Real Results (583KB, 88 files)

```
┌──────────────┬──────────┬───────────┬─────────────┐
│ Mode         │ Size     │ Tokens    │ Reduction   │
├──────────────┼──────────┼───────────┼─────────────┤
│ Basic        │  476 KB  │  ~121,724 │  20%        │
│ Semantic     │   23 KB  │    ~5,641 │  96%        │
│ Ultimate     │   11 KB  │    ~2,808 │  98%        │
└──────────────┴──────────┴───────────┴─────────────┘

Token Savings: Up to 118,916 tokens! 🚀
```

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
  --semantic              Enable AST-based semantic summaries (NEW v2.0.2)
  --smart                 Enable smart filtering by importance (NEW v2.0.2)
  --threshold <number>    Importance threshold for smart mode (default: 5)
  --incremental           Only process changed files (NEW v2.0.2)
  --top <number>          Include only top N most important files (NEW v2.0.2)
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

## 🧠 Semantic Mode (v2.0.2)

### What is Semantic Mode?

Instead of including full code, semantic mode extracts **structural summaries** using AST parsing:

**Before (Basic Mode):**
```javascript
// Full code included (5000+ tokens)
class ContextBuilder {
  buildAnalysisContext(analysisResults) {
    const sections = [];
    // ... 100 lines of implementation
  }
  // ... more methods
}
module.exports = new ContextBuilder();
```

**After (Semantic Mode):**
```
## src/ai/context-builder.js
EXPORTS: ContextBuilder

SUMMARY:
Exports: ContextBuilder

Classes:
  ContextBuilder

Imports: 2 modules
```

**Result:** Same architectural understanding, 95% fewer tokens! 🎯

### When to Use Semantic Mode

✅ **Perfect for:**
- Architecture analysis
- Understanding module relationships
- Identifying key components
- Large codebases (100+ files)
- Token-limited contexts

❌ **Not ideal for:**
- Debugging specific implementation
- Code review of logic
- Understanding algorithms
- Small projects (<10 files)

---

## 🎯 Smart Filtering (v2.0.2)

Filter files by **importance score** based on:
- Exports (5 points each)
- Functions (2 points each)
- Classes (3 points each)
- Imports (1 point each, max 10)

```bash
# Only files with score ≥ 10
comprax . --smart --threshold 10

# Top 20 most important files
comprax . --smart --top 20

# Combine with semantic mode
comprax . --semantic --smart --top 15
```

---

## ⚡ Incremental Mode (v2.0.2)

**First run:** Normal processing
```bash
comprax . --incremental -c -o output.txt
# Processes 88 files: ~2.5s
```

**Second run:** Lightning fast ⚡
```bash
comprax . --incremental -c -o output.txt
# Reuses cache: ~0.3s (10x faster!)
```

Cache stored in `.comprax-cache/` - safe to commit or `.gitignore`.

---

## 📚 Examples

### Basic Workflows
```bash
# Quick compression
comprax .

# Single file
comprax ./src -c -o compressed.txt

# Exclude tests
comprax . -e tests __tests__ -c
```

### Semantic Mode Workflows 🆕
```bash
# Maximum token reduction
comprax . --semantic -c -o analysis.txt

# Semantic + directory structure
comprax . --semantic

# Only summaries for top 30 files
comprax . --semantic --smart --top 30 -c
```

### Advanced Workflows 🔥
```bash
# Ultimate compression (98% reduction)
comprax . -m hybrid --semantic --smart --top 25 -c -o ultimate.txt

# Fast incremental with semantic
comprax . --semantic --incremental -c

# TypeScript only, top 15 files
comprax . --semantic -i .ts .tsx --top 15 -c

# Custom threshold filtering
comprax . --smart --threshold 15 -c
```

### Real-World Use Cases
```bash
# Prepare for AI architecture review
comprax . --semantic --smart --top 30 -c -o for-ai.txt

# Daily snapshot with caching
comprax . --incremental --semantic -c -o snapshots/$(date +%Y%m%d).txt

# Focus on core modules only
comprax ./src/core --semantic -c -o core-analysis.txt

# Exclude tests, get top 20 important files
comprax . -e __tests__ --smart --top 20 -c
```

---

## 📊 Example Output

### Semantic Mode Output

```
======================================================================
PROJECT: my-app
======================================================================
Runtime: Node.js
Database: PostgreSQL
Libraries: Prisma, Axios
Total Files: 42
======================================================================

## src/auth/service.js
EXPORTS: AuthService

SUMMARY:
Exports: AuthService

Classes:
  AuthService

Functions:
  login(credentials)
  logout(token)
  refreshToken(token)
  verifyToken(token)

Imports: 5 modules
```

### Hybrid + Semantic Output

Combines export detection with structural summaries:

```
## src/api/users.js
EXPORTS: getUser, createUser, updateUser, deleteUser

SUMMARY:
Exports: getUser, createUser, updateUser, deleteUser

Functions:
  getUser(id)
  createUser(data)
  updateUser(id, data)
  deleteUser(id)
  validateUserData(data)

Imports: 3 modules
```

---

## 🎯 Use Cases

### 1. Architecture Analysis with AI
```bash
comprax . --semantic --smart --top 25 -c -o architecture.txt
# Upload to Claude/ChatGPT
# 98% token reduction = more context fits!
# Ask: "Analyze the architecture and suggest improvements"
```

### 2. Understanding Large Codebases
```bash
comprax . --semantic -c -o overview.txt
# Get structural overview of 100+ files
# Perfect for onboarding or documentation
```

### 3. Focused Code Review
```bash
comprax ./src --semantic --smart --threshold 10 -c -o review.txt
# Only important files with summaries
# Share with team + AI
```

### 4. Daily Development Snapshots
```bash
comprax . --incremental --semantic -c -o daily/$(date +%Y%m%d).txt
# Fast re-runs with caching
# Track architectural changes over time
```

### 5. Token-Optimized Analysis
```bash
comprax . --semantic --top 15 -c -o minimal.txt
# Fits in smallest LLM contexts
# Maximum understanding, minimum tokens
```

---

## 🛠️ What Gets Compressed

### ✅ Basic Mode
- Removes excessive whitespace
- Preserves important comments (TODO, FIXME, etc.)
- Maintains code structure
- ~20% compression

### ✅ Semantic Mode (NEW v2.0.2)
- Extracts exports, functions, classes
- Generates structural summaries
- **Removes all code implementation**
- ~96-98% compression
- Preserves architectural understanding

### 🎯 What's Preserved in Semantic Mode
- All export names
- Function signatures with parameters
- Class names
- Import dependencies
- Module relationships

### ❌ What's Removed in Semantic Mode
- Function implementations
- Code logic
- Comments (except in summaries)
- Variable values

---

## 🔧 Integration

### npm Scripts
```json
{
  "scripts": {
    "compress": "comprax .",
    "compress:semantic": "comprax . --semantic -c -o analysis.txt",
    "compress:ultimate": "comprax . -m hybrid --semantic --smart --top 25 -c",
    "compress:fast": "comprax . --incremental --semantic -c"
  }
}
```

### CI/CD Integration

**GitHub Actions:**
```yaml
name: Codebase Analysis
on: [push]

jobs:
  compress:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npx comprax . --semantic --smart --top 30 -c -o compressed.txt
      - uses: actions/upload-artifact@v3
        with:
          name: semantic-analysis
          path: compressed.txt
```

---

## ❓ FAQ

### Q: What's the difference between basic, hybrid, and semantic modes?
**A:** 
- **Basic:** Fast compression (~20%), full code included
- **Hybrid:** Export detection + stack analysis (~16%), full code included
- **Semantic:** AST-based summaries (~96%), code removed, structure preserved
- **Ultimate:** Hybrid + Semantic + Top-N (~98%), best architectural overview

### Q: When should I use semantic mode?
**A:** Use semantic mode when you need to understand architecture, module relationships, or fit large codebases into LLM contexts. Perfect for analysis, documentation, and high-level understanding.

### Q: Will I lose debugging context in semantic mode?
**A:** You'll lose implementation details but gain a complete architectural map. For debugging specific code, use basic or hybrid mode. For understanding structure, semantic is ideal.

### Q: Does semantic mode work with TypeScript?
**A:** Yes! Works with JavaScript, TypeScript, JSX, and TSX. Supports both CommonJS and ESM.

### Q: How does incremental mode work?
**A:** Comprax caches processed files (MD5 hash + full data). On re-runs, unchanged files are retrieved from cache instantly, making subsequent compressions 10x faster.

### Q: What's a good importance threshold?
**A:**
- `threshold: 3` - Include most files (lenient)
- `threshold: 5` - Default (balanced)
- `threshold: 10` - Only important modules (strict)
- `threshold: 15+` - Core architecture only (very strict)

### Q: Can I combine all features?
**A:** Yes! The "ultimate" mode combines everything:
```bash
comprax . -m hybrid --semantic --smart --top 25 --incremental -c
```

### Q: Is v2.0.2 backward compatible?
**A:** 100%! All v1 and v2.0 commands work identically. New features are opt-in.

---

## 📈 Performance Benchmarks

### Processing Speed
- **Basic mode:** ~0.28s for 20 files
- **Semantic mode:** ~0.35s for 20 files (+25% overhead for AST parsing)
- **Smart filtering:** ~0.27s (faster due to filtering)
- **Incremental (cached):** ~0.03s (10x faster)

### Token Reduction
| Project Size | Basic | Semantic | Ultimate |
|--------------|-------|----------|----------|
| Small (20 files) | 12% | 94% | 90% |
| Medium (88 files) | 20% | 96% | 98% |
| Large (200+ files) | 25% | 97% | 99% |

---

## 🗺️ Roadmap

### ✅ v1.0.0
- Smart compression
- Directory organization
- Comment preservation

### ✅ v2.0.0
- Export detection
- Stack analysis
- Hybrid mode
- Smart prompts

### ✅ v2.0.2 (Current)
- AST-based semantic analysis
- Smart filtering by importance
- Top-N file selection
- Incremental caching
- CommonJS + ESM support
- 96-98% token reduction

### 🔮 Future
- Multi-language support (Python, Go, Rust)
- Custom scoring algorithms
- Interactive mode
- VS Code extension
- API for programmatic use

**Your feedback shapes our roadmap! Open an issue to suggest features.**

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

If Comprax helps you:
- ⭐ Star the repo
- 📢 Share with your team
- 🐛 Report bugs
- 💡 Suggest features
- 💬 Share your use cases

---

**Made with ❤️ by [Ajay Thorat](https://github.com/AjayBThorat-20)**

*Comprax v2.0.2 - May 2026 - AST-powered semantic analysis for maximum token reduction*
