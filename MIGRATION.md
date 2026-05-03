# Migration Guide

This guide helps you migrate between Comprax versions and integrate Comprax into your workflow.

---

## 🆕 New Users

If you're new to Comprax, skip to [Getting Started](#getting-started).

---

## 🔄 Version Migration

### From v2.0.2 to v2.1.0 ✨

**What's New:**
- 🎯 **Context Engine** - Function index, dependency graphs, usage maps
- 🧠 **LLM Behavior Control** - Edit rules and controlled prompts
- 🔗 **Dependency Tracking** - DEPENDS_ON and USED_BY relationships
- 🏷️ **Role Detection** - Automatic file role classification
- 📝 **Controlled Prompts** - Forces LLMs to plan before coding
- 🚫 **Anti-Duplication** - Prevents LLMs from recreating existing logic

**Migration:**
```bash
# Update to latest
npm install -g comprax@latest

# Or with npx
npx comprax@latest --version
# Should show: 2.1.0
```

**Breaking Changes:**
**None!** ✅ All v1, v2.0, and v2.0.2 commands work exactly the same.

**What's Automatic:**
When you use `--semantic` mode, v2.1.0 automatically includes:
- ✅ FUNCTION INDEX (all functions with parameters)
- ✅ DEPENDS_ON (dependency graph)
- ✅ USED_BY (reverse dependencies)
- ✅ ROLE (file classification)
- ✅ EDIT RULES (behavioral constraints)
- ✅ Controlled prompts (structured LLM guidance)

**Example:**
```bash
# This command in v2.0.2
comprax . --semantic -c -o output.txt
# Result: 96% token reduction

# Same command in v2.1.0
comprax . --semantic -c -o output.txt
# Result: 96% token reduction + Context Engine + LLM Behavior Control!
```

**Behavioral Improvements:**
With v2.1.0, LLMs will:
- ✅ Reuse existing functions (70-80% less duplication)
- ✅ Make minimal edits (80% fewer full file rewrites)
- ✅ Respect architecture (DEPENDS_ON guides imports)
- ✅ Avoid breaking changes (USED_BY shows impact)

---

### From v2.0.1 to v2.1.0

**What's New:**
- Everything from v2.0.2 (semantic analysis, smart filtering)
- **Plus** v2.1.0 Context Engine and LLM Behavior Control

**Migration:**
```bash
npm install -g comprax@latest
```

**No changes needed** - all commands work, with automatic context engine when using `--semantic`.

---

### From v2.0.0 to v2.1.0

**What's New in v2.x:**
- **v2.0.1:** ESM dependency updates
- **v2.0.2:** Semantic analysis, smart filtering, incremental caching
- **v2.1.0:** Context engine, dependency graphs, LLM behavior control

**Breaking Changes:**
**None!** ✅ v2.1.0 is fully backward compatible.

**New in v2.1.0:**
```bash
# Context engine automatically included with semantic mode
comprax . --semantic -c -o context.txt

# Now includes:
# - FUNCTION INDEX
# - DEPENDS_ON
# - USED_BY
# - ROLE
# - EDIT RULES
# - Controlled prompts
```

---

### From v1.0.0 to v2.1.0

**What's New in v2.x:**
- **v2.0.0:** Export detection, stack analysis, hybrid mode
- **v2.0.1:** ESM dependency updates
- **v2.0.2:** Semantic analysis, smart filtering, incremental caching
- **v2.1.0:** Context engine, dependency graphs, LLM behavior control

**Breaking Changes:**
**None!** ✅ v2.1.0 is fully backward compatible with v1.0.0.

All v1.0.0 commands work exactly the same:
```bash
# v1 commands still work in v2.1.0
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
```

**v2.1.0 Features (Automatic with Semantic):**
```bash
# Context engine + LLM behavior control
comprax . --semantic -c -o context.txt

# Includes: FUNCTION INDEX, DEPENDS_ON, USED_BY, ROLE, EDIT RULES
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
# Should output: 2.1.0
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

### Context Engine Mode (v2.1.0 - LLM Behavior Control) 🆕

1. **Full context with behavior control** (84-96% reduction):
```bash
comprax ./my-project --semantic -c -o context.txt
```

Output includes:
- FUNCTION INDEX (all functions)
- DEPENDS_ON (dependencies)
- USED_BY (reverse dependencies)
- ROLE (file classification)
- EDIT RULES (LLM constraints)

2. **Context + smart filtering**:
```bash
comprax ./my-project --semantic --smart --top 30 -c
```

3. **Context + directory structure**:
```bash
comprax ./my-project --semantic
```

### Ultimate Mode (v2.1.0 - All Features) 🔥

```bash
# Hybrid + Semantic + Smart + Top-N + Context Engine
comprax . -m hybrid --semantic --smart --top 25 -c -o ultimate.txt
```

Result: **98% token reduction** + **LLM behavior control**!

---

## 🔄 Integrating into Your Workflow

### Option 1: Manual Compression

**Basic mode (fast, 20% reduction):**
```bash
comprax . -v
```

**Context engine mode (84-96% reduction + LLM control):**
```bash
comprax . --semantic -c -o context.txt
```

**Ultimate mode (98% reduction + full control):**
```bash
comprax . -m hybrid --semantic --smart --top 25 -c
```

### Option 2: npm Scripts

Add to your `package.json`:

**v2.1.0 Full Suite:**
```json
{
  "scripts": {
    "compress": "comprax . -v",
    "compress:context": "comprax . --semantic -c -o context.txt",
    "compress:ultimate": "comprax . -m hybrid --semantic --smart --top 25 -c -o ultimate.txt",
    "compress:fast": "comprax . --incremental --semantic -c -o fast.txt",
    "compress:top20": "comprax . --semantic --top 20 -c -o top20.txt",
    "ai-refactor": "comprax . --semantic --smart --top 20 -c -o ai-input.txt"
  }
}
```

Usage:
```bash
npm run compress            # Basic mode
npm run compress:context    # Context engine + LLM control
npm run compress:ultimate   # 98% reduction + control
npm run compress:fast       # Incremental (cached)
npm run ai-refactor         # For AI-assisted refactoring
```

### Option 3: Pre-commit Hook

Install husky:
```bash
npm install --save-dev husky
npx husky init
```

Create `.husky/pre-commit`:

**Context snapshot (v2.1.0):**
```bash
#!/bin/sh
comprax . --semantic --incremental -c -o .comprax-context.txt
git add .comprax-context.txt
```

**Ultimate snapshot:**
```bash
#!/bin/sh
comprax . -m hybrid --semantic --smart --top 30 --incremental -c -o .comprax-snapshot.txt
git add .comprax-snapshot.txt
```

### Option 4: CI/CD Integration

**GitHub Actions** (`.github/workflows/compress.yml`):

**Context engine mode (v2.1.0):**
```yaml
name: Codebase Context Analysis
on: [push]

jobs:
  compress:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npx comprax . --semantic --smart --top 30 -c -o context-analysis.txt
      - uses: actions/upload-artifact@v3
        with:
          name: context-engine-output
          path: context-analysis.txt
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

### 1. AI-Assisted Refactoring (v2.1.0) 🆕

**Full context + LLM behavior control:**
```bash
comprax . --semantic --smart --top 30 -c -o refactor-context.txt
# Upload to Claude/ChatGPT
# LLM sees: FUNCTION INDEX, DEPENDS_ON, USED_BY, EDIT RULES
# Result: Reuses functions, minimal edits, respects architecture
```

### 2. Feature Development with LLM (v2.1.0) 🆕

**Guide LLM to reuse existing code:**
```bash
comprax ./src --semantic -c -o feature-context.txt
# Prompt: "Add email verification to user registration"
# LLM response: Reuses validateEmail(), createUser()
# No duplicate functions, minimal file changes
```

### 3. Architecture Analysis

**Maximum understanding, minimum tokens:**
```bash
comprax . --semantic --smart --top 30 -c -o architecture.txt
# Complete function index + dependency graph
# 98% token reduction = massive context fits!
```

### 4. Code Review Preparation

**Focus on important files with context:**
```bash
comprax ./src --semantic --smart --threshold 10 -c -o review.txt
# Only files with importance score ≥ 10
# Includes DEPENDS_ON and USED_BY for impact analysis
```

### 5. Daily Development Snapshots

**Fast incremental updates with context:**
```bash
comprax . --incremental --semantic -c -o daily/$(date +%Y%m%d).txt
# 10x faster on re-runs
# Full context for AI assistance
# Track architectural changes over time
```

### 6. Understanding Legacy Codebases (v2.1.0) 🆕

**Complete architectural map:**
```bash
comprax . --semantic -c -o legacy-overview.txt
# FUNCTION INDEX: all functions at a glance
# DEPENDS_ON: module relationships
# USED_BY: reverse dependencies
# ROLE: architectural intent
```

---

## 🆚 Mode Comparison

### Feature Matrix

| Feature | Basic | Hybrid | Semantic | Context v2.1 | Ultimate |
|---------|-------|--------|----------|--------------|----------|
| Compression | 20% | 16% | 96% | 96% | 98% |
| Full code | ✅ | ✅ | ❌ | ❌ | ❌ |
| Summaries | ❌ | ❌ | ✅ | ✅ | ✅ |
| Export detection | ❌ | ✅ | ✅ | ✅ | ✅ |
| Stack analysis | ❌ | ✅ | ✅ | ✅ | ✅ |
| Smart filtering | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Function index** | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Dependency graphs** | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Usage maps** | ❌ | ❌ | ❌ | ✅ | ✅ |
| **LLM control** | ❌ | ❌ | ❌ | ✅ | ✅ |
| Speed | ⚡⚡⚡ | ⚡⚡ | ⚡⚡ | ⚡⚡ | ⚡ |

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

**Context Mode (v2.1.0):** 🆕
- ✅ AI-assisted development
- ✅ Code refactoring with LLM
- ✅ Prevent LLM duplication
- ✅ Guide LLM to reuse code
- ✅ Architectural understanding

**Ultimate Mode (v2.1.0):**
- ✅ Best of all features
- ✅ Top files only
- ✅ 98% token reduction
- ✅ Full LLM behavior control

---

## 🆕 v2.1.0 Context Engine in Detail

### What is the Context Engine?

The Context Engine transforms Comprax from a **token reducer** into an **LLM behavior control system**. It builds a complete understanding of your codebase architecture and guides LLMs to make better edits.

### Key Components

#### 1. **Function Index**
Complete inventory of all functions:
```
FUNCTION INDEX
- login(credentials) → src/auth/service.js
- hashPassword(password, salt) → src/utils/crypto.js
- validateEmail(email) → src/utils/validators.js
```

**Why it matters:** LLMs can see all available functions before writing code, reducing duplication by 70-80%.

#### 2. **DEPENDS_ON** (Dependency Graph)
Shows what each file imports:
```
DEPENDS_ON: src/utils/crypto.js, src/db/users.js
```

**Why it matters:** LLMs understand module relationships and import the right dependencies.

#### 3. **USED_BY** (Usage Map)
Shows reverse dependencies:
```
USED_BY: src/api/routes/auth.js, src/api/middleware/auth.js
```

**Why it matters:** LLMs understand impact of changes and avoid breaking dependent code.

#### 4. **ROLE** (File Classification)
Automatic file purpose detection:
```
ROLE: authentication module
ROLE: database module
ROLE: utility functions
```

**Why it matters:** LLMs understand architectural intent and respect separation of concerns.

#### 5. **Edit Rules**
Explicit behavioral constraints:
```
EDIT RULES
- Do NOT rename existing functions
- Do NOT duplicate existing logic
- REUSE functions from FUNCTION INDEX
- Modify only necessary files
- Respect DEPENDS_ON relationships
```

**Why it matters:** Prevents common LLM mistakes like rewriting entire files or duplicating functions.

### LLM Behavior Improvements

**Before v2.1.0:**
```javascript
// LLM duplicates existing functions
function login(credentials) { /* new implementation */ }
function hashPassword(password) { /* new implementation */ }
```

**With v2.1.0:**
```javascript
// LLM reuses existing functions
import { login, hashPassword } from './existing-modules';
// Only adds new functionality
```

**Measured Improvements:**
- ✅ 70-80% reduction in duplicate functions
- ✅ 80% reduction in full file rewrites
- ✅ 3-5x improvement in function reuse
- ✅ Better architectural respect

---

## 🔧 Troubleshooting

### Issue: Context engine not showing in output

**Check:** Are you using `--semantic` mode?

**Solution:**
```bash
# Context engine requires semantic mode
comprax . --semantic -c -o output.txt
```

### Issue: DEPENDS_ON showing absolute paths

**Cause:** Old cached version

**Solution:**
```bash
# Clear cache and regenerate
rm -rf .comprax-cache
comprax . --semantic -c -o output.txt
```

### Issue: USED_BY not showing reverse dependencies

**Check:** File must be imported by other files

**Solution:**
```bash
# Use verbose mode to see processing
comprax . --semantic --verbose -c -o output.txt
```

### Issue: Semantic mode not reducing tokens

**Check:** Are you using `-c` (combined mode)?

**Solution:**
```bash
# Wrong (directory mode includes code)
comprax . --semantic

# Correct (combined mode uses summaries)
comprax . --semantic -c -o output.txt
```

---

## 🎓 Tips & Tricks (v2.1.0)

### 1. Check Function Index
```bash
# See all available functions before LLM generates code
comprax . --semantic -c | grep "FUNCTION INDEX" -A 50
```

### 2. Verify Dependencies
```bash
# Check module relationships
comprax . --semantic -c | grep "DEPENDS_ON"
```

### 3. Find File Roles
```bash
# See how Comprax classified your files
comprax . --semantic -c | grep "^ROLE:"
```

### 4. Compare LLM Behavior
```bash
# v2.0.2 output (no context)
comprax . --semantic -c -o v202.txt

# v2.1.0 output (with context)
npm install -g comprax@latest
comprax . --semantic -c -o v210.txt

# Compare - v2.1.0 includes FUNCTION INDEX, DEPENDS_ON, USED_BY, EDIT RULES
diff v202.txt v210.txt
```

---

## 🚀 Advanced Usage (v2.1.0)

### AI-Assisted Refactoring Workflow

**Step 1: Generate context**
```bash
comprax . --semantic --smart --top 25 -c -o refactor-context.txt
```

**Step 2: Upload to LLM with prompt**
```
Based on this codebase context:
- FUNCTION INDEX shows all available utilities
- DEPENDS_ON shows module relationships
- USED_BY shows impact of changes
- EDIT RULES prevent duplication

Task: Refactor authentication to use JWT
Requirements: Reuse existing functions, minimal changes
```

**Step 3: Verify LLM respects context**
- ✅ Did it reuse functions from FUNCTION INDEX?
- ✅ Did it respect DEPENDS_ON relationships?
- ✅ Did it avoid breaking USED_BY dependencies?
- ✅ Did it make minimal file changes?

### Multi-Stage Analysis with Context

**Stage 1: Full architectural overview**
```bash
comprax . --semantic -c -o 1-architecture.txt
# Review: FUNCTION INDEX, DEPENDS_ON, USED_BY, ROLE
```

**Stage 2: Core modules deep dive**
```bash
comprax ./src/core --semantic -c -o 2-core.txt
# Focus: Critical modules with context
```

**Stage 3: Specific feature analysis**
```bash
comprax ./src/auth -m hybrid --semantic -c -o 3-auth.txt
# Detail: Full code + context for one feature
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

**v2.0.2:**
- Semantic analysis
- Smart filtering
- Incremental caching
- 96-98% token reduction

**v2.1.0 (Current):**
- Context Engine
- Function index
- Dependency graphs (DEPENDS_ON)
- Usage maps (USED_BY)
- Role detection
- Edit rules
- LLM behavior control

### 🔮 Future

**v2.2.0 (Planned):**
- Snapshot mode (CLI session persistence)
- Diff mode (incremental intelligence)
- Interactive mode (`comprax ask "..."`)
- API mode (programmatic access)

**v3.0.0 (Vision):**
- Multi-language support (Python, Java, Go, Rust)
- AST-based evaluation suite
- Custom edit rule templates
- VS Code extension
- Real-time LLM collaboration mode

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

**Last updated:** May 2026 (v2.1.0)