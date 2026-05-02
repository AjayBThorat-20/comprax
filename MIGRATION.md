# Migration Guide

This guide helps you migrate between Comprax versions and integrate Comprax into your workflow.

---

## 🆕 New Users

If you're new to Comprax, skip to [Getting Started](#getting-started).

---

## 🔄 Version Migration

### From v2.0.1 to v2.0.2 ✨

**What's New:**
- 🧠 **AST-based Semantic Analysis** - Extract code structure without including implementation
- 🎯 **Smart Filtering** - Filter files by importance score
- 🔝 **Top-N Selection** - Include only the most important files
- ⚡ **Incremental Mode** - Cache-based processing (10x faster on re-runs)
- 📉 **96-98% Token Reduction** - Massive savings with semantic summaries
- 🔄 **CommonJS Support** - Full support for `module.exports` and `require()`

**Migration:**
```bash
# Update to latest
npm install -g comprax@latest

# Or with npx
npx comprax@latest --version
# Should show: 2.0.2
```

**Breaking Changes:**
**None!** ✅ All v1 and v2.0 commands work exactly the same.

**New Features (Opt-in):**
```bash
# Semantic mode - 96% token reduction
comprax . --semantic -c -o analysis.txt

# Smart filtering
comprax . --smart --threshold 10

# Top N files
comprax . --top 20

# Incremental mode
comprax . --incremental

# Ultimate combination
comprax . -m hybrid --semantic --smart --top 25 -c
```

---

### From v2.0.0 to v2.0.1

**What's Changed:**
- Dependency updates (chalk, commander, ora) to latest ESM versions
- Internal migration to ES Modules (import/export)
- No feature changes
- No breaking changes

**Migration:**
```bash
npm install -g comprax@latest
```

---

### From v1.0.0 to v2.0.2

**What's New in v2.x:**
- **v2.0.0:** Export detection, stack analysis, hybrid mode
- **v2.0.1:** ESM dependency updates
- **v2.0.2:** Semantic analysis, smart filtering, incremental caching

**Breaking Changes:**
**None!** ✅ v2.x is fully backward compatible with v1.0.0.

All v1.0.0 commands work exactly the same:
```bash
# v1 commands still work in v2.0.2
comprax .
comprax . -c
comprax . -e tests
```

**New Features:**

**v2.0 Features:**
```bash
# Hybrid mode (export detection + stack analysis)
comprax . -m hybrid
```

**v2.0.2 Features:**
```bash
# Semantic mode (96-98% token reduction)
comprax . --semantic

# Smart filtering
comprax . --smart --threshold 10

# Top N selection
comprax . --top 20

# Incremental mode
comprax . --incremental

# Ultimate mode
comprax . -m hybrid --semantic --smart --top 25
```

---

## 📦 Installing Comprax

### Using npx (No Installation Required)
```bash
npx comprax ./my-project
```

### Global Installation (Recommended)
```bash
npm install -g comprax
```

### With sudo (Linux/Mac)
```bash
sudo npm install -g comprax
```

### Local Installation (Project-specific)
```bash
npm install --save-dev comprax
```

### Verify Installation
```bash
comprax --version
# Should output: 2.0.2
```

---

## 🚀 Getting Started

### Basic Mode (v1 Compatible)

1. **Compress entire project** (creates directory structure):
```bash
comprax ./my-project
```

Output:
```
comprax-output/
└── my-project/
    ├── _summary.txt
    ├── src_components.txt
    ├── src_utils.txt
    └── ...
```

2. **Create single combined file**:
```bash
comprax ./my-project -c -o project.txt
```

3. **Compress specific directory**:
```bash
comprax ./my-project/src
```

### Semantic Mode (v2.0.2 - Maximum Token Reduction) 🆕

1. **Basic semantic compression** (96% reduction):
```bash
comprax ./my-project --semantic -c -o analysis.txt
```

2. **Semantic + directory structure**:
```bash
comprax ./my-project --semantic
```

3. **Top 30 files with semantic summaries**:
```bash
comprax ./my-project --semantic --smart --top 30 -c
```

### Ultimate Mode (v2.0.2 - All Features) 🔥

```bash
# Hybrid + Semantic + Smart + Top-N
comprax . -m hybrid --semantic --smart --top 25 -c -o ultimate.txt
```

Result: **98% token reduction** with full architectural understanding!

---

## 🔄 Integrating into Your Workflow

### Option 1: Manual Compression

**Basic mode (fast, 20% reduction):**
```bash
comprax . -v
```

**Semantic mode (96% reduction):**
```bash
comprax . --semantic -c -o analysis.txt
```

**Ultimate mode (98% reduction):**
```bash
comprax . -m hybrid --semantic --smart --top 25 -c
```

### Option 2: npm Scripts

Add to your `package.json`:

**v2.0.2 Full Suite:**
```json
{
  "scripts": {
    "compress": "comprax . -v",
    "compress:semantic": "comprax . --semantic -c -o analysis.txt",
    "compress:ultimate": "comprax . -m hybrid --semantic --smart --top 25 -c -o ultimate.txt",
    "compress:fast": "comprax . --incremental --semantic -c -o fast.txt",
    "compress:top20": "comprax . --semantic --top 20 -c -o top20.txt"
  }
}
```

Usage:
```bash
npm run compress            # Basic mode
npm run compress:semantic   # 96% reduction
npm run compress:ultimate   # 98% reduction
npm run compress:fast       # Incremental (cached)
npm run compress:top20      # Top 20 files only
```

### Option 3: Pre-commit Hook

Install husky:
```bash
npm install --save-dev husky
npx husky init
```

Create `.husky/pre-commit`:

**Semantic snapshot (v2.0.2):**
```bash
#!/bin/sh
comprax . --semantic --incremental -c -o .comprax-snapshot.txt
git add .comprax-snapshot.txt
```

**Ultimate snapshot:**
```bash
#!/bin/sh
comprax . -m hybrid --semantic --smart --top 30 --incremental -c -o .comprax-snapshot.txt
git add .comprax-snapshot.txt
```

### Option 4: CI/CD Integration

**GitHub Actions** (`.github/workflows/compress.yml`):

**Semantic mode (v2.0.2):**
```yaml
name: Semantic Codebase Analysis
on: [push]

jobs:
  compress:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npx comprax . --semantic --smart --top 30 -c -o semantic-analysis.txt
      - uses: actions/upload-artifact@v3
        with:
          name: semantic-analysis
          path: semantic-analysis.txt
```

**Ultimate mode:**
```yaml
name: Ultimate Codebase Compression
on: [push]

jobs:
  compress:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npx comprax . -m hybrid --semantic --smart --top 25 -c -o ultimate.txt
      - uses: actions/upload-artifact@v3
        with:
          name: ultimate-compression
          path: ultimate.txt
```

---

## 🎯 Use Case Examples

### 1. Architecture Analysis (v2.0.2)

**Maximum understanding, minimum tokens:**
```bash
comprax . --semantic --smart --top 30 -c -o architecture.txt
# Upload to Claude/ChatGPT
# 98% token reduction = massive context fits!
```

### 2. Code Review Preparation

**Focus on important files:**
```bash
comprax ./src --semantic --smart --threshold 10 -c -o review.txt
# Only files with importance score ≥ 10
```

### 3. Daily Development Snapshots

**Fast incremental updates:**
```bash
comprax . --incremental --semantic -c -o daily/$(date +%Y%m%d).txt
# 10x faster on re-runs
# Perfect for tracking changes
```

### 4. Large Codebase Analysis

**Top files only:**
```bash
comprax . --semantic --top 50 -c -o large-project.txt
# Fits huge projects into LLM context
```

### 5. Documentation Generation

**Hybrid + Semantic:**
```bash
comprax . -m hybrid --semantic -c -o docs/codebase.txt
# Full architectural understanding
# Perfect for doc generation
```

---

## 🆚 Mode Comparison

### Feature Matrix

| Feature | Basic | Hybrid | Semantic | Ultimate |
|---------|-------|--------|----------|----------|
| Compression | 20% | 16% | 96% | 98% |
| Full code | ✅ | ✅ | ❌ | ❌ |
| Summaries | ❌ | ❌ | ✅ | ✅ |
| Export detection | ❌ | ✅ | ✅ | ✅ |
| Stack analysis | ❌ | ✅ | ✅ | ✅ |
| Smart filtering | ❌ | ❌ | ✅ | ✅ |
| Speed | ⚡⚡⚡ | ⚡⚡ | ⚡⚡ | ⚡ |

### When to Use Each Mode

**Basic Mode:**
- ✅ Need full code
- ✅ Maximum compression speed
- ✅ Debugging specific implementation

**Hybrid Mode:**
- ✅ Export detection needed
- ✅ Stack analysis helpful
- ✅ Full code with context

**Semantic Mode (v2.0.2):**
- ✅ Architecture analysis
- ✅ Module relationships
- ✅ Maximum token reduction
- ✅ Large codebases

**Ultimate Mode (v2.0.2):**
- ✅ Best of all features
- ✅ Top files only
- ✅ 98% token reduction
- ✅ Perfect for AI analysis

---

## 🆕 v2.0.2 Features in Detail

### Semantic Analysis

**What it does:**
- Parses code with AST (Babel)
- Extracts exports, functions, classes
- Generates structural summaries
- **Removes all code implementation**

**Example:**

Before (Basic mode):
```javascript
// Full code: 5000 tokens
class ContextBuilder {
  buildAnalysisContext(analysisResults) {
    const sections = [];
    // ... 100 lines of implementation
  }
  // ... more methods
}
module.exports = new ContextBuilder();
```

After (Semantic mode):
```
## src/ai/context-builder.js
EXPORTS: ContextBuilder

SUMMARY:
Exports: ContextBuilder

Classes:
  ContextBuilder

Imports: 2 modules
```

**Result:** 95% token reduction, same architectural understanding!

### Smart Filtering

**Importance scoring:**
- Exports: 5 points each
- Functions: 2 points each
- Classes: 3 points each
- Imports: 1 point each (max 10)

**Usage:**
```bash
# Only files with score ≥ 10
comprax . --smart --threshold 10

# Top 20 most important
comprax . --smart --top 20

# Custom threshold
comprax . --smart --threshold 15
```

### Incremental Mode

**How it works:**
1. First run: Processes all files, creates cache
2. Second run: Reuses cached data for unchanged files
3. Result: 10x faster!

**Usage:**
```bash
# First run
comprax . --incremental -c -o output.txt
# Takes: ~2.5s

# Second run (no changes)
comprax . --incremental -c -o output.txt
# Takes: ~0.3s (10x faster!)
```

**Cache location:** `.comprax-cache/file-cache.json`

### CommonJS Support

**Now supports:**
- `module.exports = ClassName`
- `module.exports = new ClassName()`
- `module.exports = { foo, bar }`
- `exports.functionName = ...`
- `const x = require('module')`

**Plus all ESM patterns:**
- `export function`, `export const`, `export class`
- `export default`
- `export { foo, bar }`
- `import ... from '...'`

---

## ⚙️ Configuration Best Practices

### Recommended `.gitignore` Entries

```
# Comprax outputs
comprax-output/
*.comprax.txt
.comprax-snapshot.txt
*-compressed.txt
*-semantic.txt
*-ultimate.txt

# Comprax cache (optional - can commit for team sharing)
.comprax-cache/
```

### Cache Management

**Cache is safe to:**
- ✅ Commit to git (helps team)
- ✅ Add to .gitignore (for local use)
- ✅ Delete anytime (will rebuild)

**Cache benefits:**
- 10x faster re-runs
- Consistent output
- Shared team cache

---

## 📊 Performance Benchmarks

### Processing Speed (20 files)
- **Basic mode:** ~0.28s
- **Semantic mode:** ~0.35s (+25% for AST parsing)
- **Smart filtering:** ~0.27s (faster due to filtering)
- **Incremental (cached):** ~0.03s (10x faster!)

### Token Reduction (88 files, 583KB)

```
┌──────────────┬──────────┬───────────┬─────────────┐
│ Mode         │ Size     │ Tokens    │ Reduction   │
├──────────────┼──────────┼───────────┼─────────────┤
│ Basic        │  476 KB  │ ~121,724  │  20%        │
│ Hybrid       │  490 KB  │ ~128,000  │  16%        │
│ Semantic     │   23 KB  │   ~5,641  │  96%        │
│ Ultimate     │   11 KB  │   ~2,808  │  98%        │
└──────────────┴──────────┴───────────┴─────────────┘
```

---

## 🔧 Troubleshooting

### Issue: Semantic mode not reducing tokens

**Check:** Are you using `-c` (combined mode)?

**Solution:**
```bash
# Wrong (directory mode includes code)
comprax . --semantic

# Correct (combined mode uses summaries)
comprax . --semantic -c -o output.txt
```

### Issue: Exports showing as "[object Object]"

**Cause:** Old version

**Solution:**
```bash
# Update to v2.0.2
npm install -g comprax@latest
comprax --version  # Should show 2.0.2
```

### Issue: Incremental mode not caching

**Check:** Make sure cache directory exists and is writable

**Solution:**
```bash
# Check cache
ls -la .comprax-cache/

# If missing, it will be created on first run
comprax . --incremental -c -o test.txt
```

### Issue: Top-N not working as expected

**Solution:** Always use with `--smart`:
```bash
# Correct
comprax . --smart --top 20

# Wrong (--smart is required)
comprax . --top 20
```

---

## 🎓 Tips & Tricks

### 1. Quick Semantic Check
```bash
# See structural overview without full compression
comprax . --semantic -c | head -n 100
```

### 2. Find Most Important Files
```bash
# Use smart mode to see scores
comprax . --smart --verbose | grep "score"
```

### 3. Compare Compressions
```bash
# Basic
comprax . -c -o basic.txt

# Semantic
comprax . --semantic -c -o semantic.txt

# Compare sizes
ls -lh basic.txt semantic.txt
# semantic.txt should be 95% smaller!
```

### 4. Incremental Development Workflow
```bash
# Add to your dev script
{
  "scripts": {
    "analyze": "comprax . --incremental --semantic -c -o analysis.txt"
  }
}

# Run frequently - it's fast!
npm run analyze
```

---

## 🚀 Advanced Usage

### Multi-Stage Analysis

**Stage 1: Full semantic overview**
```bash
comprax . --semantic -c -o 1-overview.txt
```

**Stage 2: Top modules with code**
```bash
comprax ./src --smart --top 10 -c -o 2-core.txt
```

**Stage 3: Specific module deep dive**
```bash
comprax ./src/auth -m hybrid -c -o 3-auth.txt
```

### Framework Migration

**Before migration:**
```bash
comprax . --semantic -c -o before-migration.txt
```

**After migration:**
```bash
comprax . --semantic -c -o after-migration.txt
```

**Compare with AI:**
Upload both files and ask: "Compare architectures and identify key changes"

### Token Budget Management

**Fit in GPT-4 context (128K tokens):**
```bash
# Ultra-compressed (2800 tokens)
comprax . --semantic --smart --top 25 -c

# Medium (5600 tokens)
comprax . --semantic --top 50 -c

# Full semantic (varies by project)
comprax . --semantic -c
```

---

## 🔮 Roadmap

### ✅ Released

**v1.0.0:**
- Smart compression
- Directory organization

**v2.0.0:**
- Export detection
- Stack analysis
- Hybrid mode

**v2.0.1:**
- ESM dependencies

**v2.0.2 (Current):**
- Semantic analysis
- Smart filtering
- Incremental caching
- CommonJS support
- 96-98% token reduction

### 🔮 Future

**v2.0.3+ (Potential):**
- Enhanced scoring algorithms
- More language support
- Faster AST parsing
- Better caching strategies

**v3.0.0 (When ready):**
- Multi-language support (Python, Go, Rust)
- Interactive mode
- VS Code extension
- API for programmatic use

---

## 📞 Support

- **GitHub Issues:** https://github.com/AjayBThorat-20/comprax/issues
- **Documentation:** https://github.com/AjayBThorat-20/comprax#readme
- **npm Package:** https://www.npmjs.com/package/comprax
- **Changelog:** [CHANGELOG.md](CHANGELOG.md)

---

## 📄 License

MIT © Ajay Thorat

---

**Last updated:** May 2026 (v2.0.2)
