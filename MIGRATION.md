```markdown
# Migration Guide

This guide helps you migrate between Comprax versions and integrate Comprax into your workflow.

---

## 🆕 New Users

If you're new to Comprax, skip to [Getting Started](#getting-started).

---

## 🔄 Version Migration

### From v2.0.0 to v2.0.1

**What's Changed:**
- Dependency updates (chalk, commander, ora) to latest ESM versions
- Internal migration to ES Modules (import/export)
- No feature changes
- No breaking changes

**Migration:**
```bash
# Update to latest
npm install -g comprax@latest

# Or with npx
npx comprax@latest --version
```

**That's it!** All commands work exactly the same.

---

### From v1.0.0 to v2.0.1 (or v2.0.0)

**What's New in v2.x:**
- **Export Detection** - Automatically identifies module exports (ES6 & CommonJS)
- **Stack Analysis** - Auto-detects frameworks, databases, and libraries
- **Hybrid Mode** - Enhanced output with structural metadata for LLMs
- **Smart Prompts** - Context-aware suggestions for AI analysis
- **Project Metadata** - Rich headers with framework and stack information

**Breaking Changes:**
**None!** ✅ v2.x is fully backward compatible with v1.0.0.

All v1.0.0 commands work exactly the same:
```bash
# v1 commands still work in v2
comprax .
comprax . -c
comprax . -e tests
```

**New in v2: Hybrid Mode**

To use v2 features, simply add the `--mode hybrid` flag:

```bash
# v1 behavior (default)
comprax ./my-project

# v2 hybrid mode (new)
comprax ./my-project --mode hybrid
comprax ./my-project -m hybrid
```

**Migration Checklist:**
- ✅ No code changes needed
- ✅ No configuration changes needed
- ✅ All v1 scripts work as-is
- ✅ Hybrid mode is opt-in
- ✅ Update: `npm install -g comprax@latest`

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
# Should output: 2.0.1
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

### Hybrid Mode (v2 - Recommended for LLM Analysis)

1. **Basic hybrid mode**:
```bash
comprax ./my-project -m hybrid
```

Output includes:
- Export annotations
- Stack detection
- Smart prompts

2. **Hybrid + single file**:
```bash
comprax ./my-project -m hybrid -c -o project.txt
```

3. **Hybrid + verbose**:
```bash
comprax ./my-project -m hybrid -v
```

---

## 🔄 Integrating into Your Workflow

### Option 1: Manual Compression

**Basic mode (fast):**
```bash
comprax . -v
```

**Hybrid mode (best for AI):**
```bash
comprax . -m hybrid -v
```

### Option 2: npm Scripts

Add to your `package.json`:

**v1 Compatible:**
```json
{
  "scripts": {
    "compress": "comprax . -v",
    "compress:single": "comprax . -c -o project.txt",
    "compress:src": "comprax ./src -e __tests__"
  }
}
```

**v2 Enhanced:**
```json
{
  "scripts": {
    "compress": "comprax . -v",
    "compress:hybrid": "comprax . -m hybrid -v",
    "compress:analysis": "comprax . -m hybrid -c -o analysis.txt",
    "compress:review": "comprax ./src -e __tests__ -c -o review.txt"
  }
}
```

Usage:
```bash
npm run compress           # Basic mode
npm run compress:hybrid    # Hybrid mode with exports
npm run compress:analysis  # Single file for AI
```

### Option 3: Pre-commit Hook

Install husky:
```bash
npm install --save-dev husky
npx husky init
```

Create `.husky/pre-commit`:

**Basic snapshot:**
```bash
#!/bin/sh
comprax . -c -o .comprax-snapshot.txt
git add .comprax-snapshot.txt
```

**Hybrid snapshot (v2):**
```bash
#!/bin/sh
comprax . -m hybrid -c -o .comprax-snapshot.txt
git add .comprax-snapshot.txt
```

### Option 4: CI/CD Integration

**GitHub Actions** (`.github/workflows/compress.yml`):

**Basic mode:**
```yaml
name: Compress Codebase
on: [push]

jobs:
  compress:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npx comprax . -c -o compressed.txt
      - uses: actions/upload-artifact@v3
        with:
          name: compressed-codebase
          path: compressed.txt
```

**Hybrid mode (v2):**
```yaml
name: Compress Codebase (Hybrid)
on: [push]

jobs:
  compress:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npx comprax . -m hybrid -c -o compressed.txt
      - uses: actions/upload-artifact@v3
        with:
          name: compressed-codebase-hybrid
          path: compressed.txt
```

**GitLab CI** (`.gitlab-ci.yml`):
```yaml
compress:
  stage: build
  image: node:18
  script:
    - npx comprax . -m hybrid -c -o compressed.txt
  artifacts:
    paths:
      - compressed.txt
```

---

## 🎯 Use Case Examples

### 1. Code Review Preparation

**Basic mode (fast):**
```bash
comprax ./src -e __tests__ -c -o review.txt
```

**Hybrid mode (with context):**
```bash
comprax ./src -m hybrid -e __tests__ -c -o review.txt
```

### 2. LLM Analysis Workflow

**Basic approach:**
```bash
comprax . -v
# Upload comprax-output/ files to ChatGPT/Claude
```

**Hybrid approach (recommended):**
```bash
comprax . -m hybrid -c -o analysis.txt
# Upload analysis.txt + _prompt.txt to AI
# AI gets export info + stack context
```

### 3. Architecture Analysis (v2)
```bash
# Use hybrid mode for architecture questions
comprax . -m hybrid -c -o architecture.txt

# Upload to Claude/ChatGPT and ask:
# "Analyze the architecture and module relationships"
# "Explain how data flows through this application"
# "What are the main exports and dependencies?"
```

### 4. Documentation Generation
```bash
# Hybrid mode provides better context for docs
comprax . -m hybrid -c -o docs/codebase-snapshot.txt
```

### 5. Project Snapshots
```bash
# Create timestamped snapshot
comprax . -c -o snapshots/project-$(date +%Y%m%d).txt

# With hybrid features
comprax . -m hybrid -c -o snapshots/project-$(date +%Y%m%d)-hybrid.txt
```

---

## 🆚 Choosing Between Basic and Hybrid Mode

### Use Basic Mode When:
- ✅ You want maximum compression (29%)
- ✅ Token limits are critical
- ✅ Fast processing is priority
- ✅ Simple text compression needed

### Use Hybrid Mode When:
- ✅ Working with AI for architecture analysis
- ✅ Understanding module relationships
- ✅ Generating documentation
- ✅ Complex codebase analysis
- ✅ Need export and dependency context

### Performance Comparison

| Metric | Basic Mode | Hybrid Mode |
|--------|-----------|-------------|
| Compression | 29% | 16% |
| Speed | Fastest | Fast |
| Export detection | ❌ | ✅ |
| Stack analysis | ❌ | ✅ |
| Smart prompts | ❌ | ✅ |
| Best for | Quick compression | AI analysis |

---

## ⚙️ Configuration Best Practices

### Recommended `.gitignore` Entries

```
# Comprax outputs
comprax-output/
*.comprax.txt
.comprax-snapshot.txt
*-compressed.txt
*-hybrid.txt
```

### Exclude Common Directories
```bash
comprax . -e \
  node_modules \
  .git \
  dist \
  build \
  coverage \
  .next \
  .cache \
  __pycache__
```

### Include Only Source Code
```bash
# JavaScript/TypeScript only
comprax . -i .js .ts .jsx .tsx

# Hybrid mode with filtering
comprax . -m hybrid -i .ts .tsx -e tests
```

---

## 📊 Output Structure Guide

### Directory Mode (Default)

**Basic mode:**
```
comprax-output/
└── project-name/
    ├── _summary.txt
    ├── src_components.txt
    ├── src_utils.txt
    └── bin.txt
```

**Hybrid mode:**
```
comprax-output/
└── project-name/
    ├── _summary.txt          # Includes stack info
    ├── _prompt.txt           # Smart prompts (NEW)
    ├── src_components.txt    # With export annotations
    ├── src_utils.txt         # With export annotations
    └── bin.txt
```

### Combined Mode (`-c`)

**Basic mode:**
```
project-compressed.txt
```

**Hybrid mode:**
```
project-compressed.txt        # With exports & metadata
project-compressed-prompt.txt # Smart prompts
```

---

## 🆕 v2.0.0+ Features in Detail

### Export Detection

Automatically detects and displays module exports:

**Supported patterns:**
- ES6: `export function`, `export const`, `export class`
- ES6: `export default`
- ES6: `export { foo, bar }`
- CommonJS: `module.exports = { ... }`
- CommonJS: `exports.name = ...`

**Example output:**
```
## src/auth.js
EXPORTS: login, logout, verifyToken

function login(username, password) {
  // ...
}
```

### Stack Detection

Auto-identifies your project stack:

**Detects:**
- Frameworks (Next.js, Express, React, Vue, Angular, etc.)
- Databases (PostgreSQL, MongoDB, MySQL, Redis, etc.)
- Libraries (Prisma, tRPC, GraphQL, Axios, etc.)
- Testing (Jest, Vitest, Cypress, Playwright)
- Build tools (Webpack, Vite, Rollup, esbuild)

**Example output:**
```
======================================================================
PROJECT: my-app
======================================================================
Framework: Next.js
Database: PostgreSQL, Redis
Libraries: Prisma, tRPC, Zod
Testing: Jest, Playwright
Total Files: 88
======================================================================
```

### Smart Prompts

Context-aware suggestions for AI analysis:

**Generated based on:**
- Detected framework
- Database stack
- Project complexity
- Common patterns

**Example:**
```
For Next.js projects:
- Analyze the routing structure and page components
- Review API routes and data fetching patterns
- Check for proper use of Server/Client Components
```

---

## 🔧 Troubleshooting

### Issue: "No code files found"
**Solution:**
```bash
# Check what's being filtered
comprax . -v

# Include more extensions
comprax . -i .js .ts .jsx .tsx .mjs .cjs
```

### Issue: Stack not detected in hybrid mode
**Cause:** No package.json in project root

**Solution:**
```bash
# Make sure you're in project root
cd /path/to/project-root
comprax . -m hybrid
```

### Issue: Exports not showing
**Cause:** File might not export anything (e.g., CLI entry points)

**Note:** This is correct behavior. Only files with exports show the EXPORTS line.

### Issue: Permission errors
**Solution:**
```bash
# Use sudo for global install
sudo npm install -g comprax

# Or use npx
npx comprax .
```

---

## 🎓 Tips & Tricks

### 1. Quick Stack Check
```bash
# See what framework/stack is detected
comprax . -m hybrid -v | grep "Stack detected"
```

### 2. Export Overview
```bash
# Hybrid mode to see all exports
comprax . -m hybrid | grep "EXPORTS:"
```

### 3. Compare Modes
```bash
# Basic mode
comprax . -c -o basic.txt

# Hybrid mode
comprax . -m hybrid -c -o hybrid.txt

# Compare file sizes
ls -lh basic.txt hybrid.txt
```

### 4. Framework-Specific Analysis
```bash
# For Next.js projects
comprax . -m hybrid -c -o nextjs-analysis.txt
# Upload to AI with: "Analyze this Next.js application"

# For Express APIs
comprax ./src -m hybrid -c -o api-analysis.txt
# Upload to AI with: "Review this Express API structure"
```

---

## 📈 Performance Tips

### For Large Projects (1000+ files)

**Basic mode (fastest):**
```bash
comprax . -e __tests__ tests -i .js .ts
```

**Hybrid mode (optimized):**
```bash
comprax ./src -m hybrid -e __tests__ -i .ts .tsx
```

### For Better AI Results

**Always use hybrid mode:**
```bash
comprax . -m hybrid -c -o ai-analysis.txt
```

**Include only relevant files:**
```bash
comprax ./src ./lib -m hybrid -e __tests__
```

---

## 🚀 Advanced Usage

### Multi-Stage Analysis

**Stage 1: Full analysis**
```bash
comprax . -m hybrid -c -o full-analysis.txt
```

**Stage 2: Module-specific**
```bash
comprax ./src/auth -m hybrid -c -o auth-module.txt
comprax ./src/api -m hybrid -c -o api-module.txt
```

### Comparative Analysis

```bash
# Compress two versions
comprax ./v1 -m hybrid -c -o v1-analysis.txt
comprax ./v2 -m hybrid -c -o v2-analysis.txt

# Upload both to LLM and ask:
# "Compare these versions, focusing on exported APIs"
```

### Framework Migration Prep

```bash
# Before migration
comprax . -m hybrid -c -o before-migration.txt

# After migration
comprax . -m hybrid -c -o after-migration.txt

# Ask AI to compare stack and exports
```

---

## 🔮 Future Development

### Potential Future Features
We're considering these features based on user feedback:

**v2.x Updates (Minor releases):**
- Additional framework detection (Astro, Qwik, SolidJS)
- More export patterns (dynamic imports, re-exports)
- Performance optimizations
- Bug fixes and improvements

**v3.0.0 (When ready):**
- Multi-language support (Python initially)
- Enhanced compression strategies
- Improved CLI experience

**Your v2.x output will remain compatible.**

---

## 📞 Support

- **GitHub Issues:** https://github.com/AjayBThorat-20/comprax/issues
- **Documentation:** https://github.com/AjayBThorat-20/comprax#readme
- **npm Package:** https://www.npmjs.com/package/comprax
- **Changelog:** https://github.com/AjayBThorat-20/comprax/blob/main/CHANGELOG.md

---

## 📄 License

MIT © Ajay Thorat

---

**Last updated:** May 2026 (v2.0.1)
```