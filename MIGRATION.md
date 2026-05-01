cat > MIGRATION.md << 'EOF'
# Migration Guide

This guide helps you migrate between Comprax versions and integrate Comprax into your workflow.

---

## 🆕 New Users

If you're new to Comprax, skip to [Getting Started](#getting-started).

---

## 📦 Installing Comprax v1.0.0

### Global Installation (Recommended)
```bash
npm install -g comprax
```

### Local Installation (Project-specific)
```bash
npm install --save-dev comprax
```

### Verify Installation
```bash
comprax --version
# Should output: 1.0.0
```

---

## 🚀 Getting Started

### Basic Usage

1. **Compress entire project** (creates directory structure):
```bash
comprax ./my-project
```
```
Output:
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

4. **Exclude directories**:
```bash
comprax ./my-project -e tests docs temp
```

5. **Include only specific extensions**:
```bash
comprax ./my-project -i .ts .tsx
```

---

## 🔄 Integrating into Your Workflow

### Option 1: Manual Compression

Run before code reviews or LLM analysis:
```bash
comprax . -v
```

### Option 2: npm Script

Add to your `package.json`:
```json
{
  "scripts": {
    "compress": "comprax . -v",
    "compress:single": "comprax . -c -o project.txt",
    "compress:src": "comprax ./src -e __tests__"
  }
}
```

Usage:
```bash
npm run compress
npm run compress:single
npm run compress:src
```

### Option 3: Pre-commit Hook

Install husky:
```bash
npm install --save-dev husky
npx husky init
```

Create `.husky/pre-commit`:
```bash
#!/bin/sh
comprax . -c -o .comprax-snapshot.txt
git add .comprax-snapshot.txt
```

This creates a compressed snapshot on every commit.

### Option 4: CI/CD Integration

**GitHub Actions** (`.github/workflows/compress.yml`):
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
      - run: npm install -g comprax
      - run: comprax . -c -o compressed.txt
      - uses: actions/upload-artifact@v3
        with:
          name: compressed-codebase
          path: compressed.txt
```

**GitLab CI** (`.gitlab-ci.yml`):
```yaml
compress:
  stage: build
  image: node:18
  script:
    - npm install -g comprax
    - comprax . -c -o compressed.txt
  artifacts:
    paths:
      - compressed.txt
```

---

## 🎯 Use Case Examples

### 1. Code Review Preparation
```bash
# Compress only source files
comprax ./src -e __tests__ -o review.txt

# Share review.txt with team or upload to Claude
```

### 2. LLM Analysis Workflow
```bash
# Full project compression
comprax . -v

# Upload comprax-output/project/ files to ChatGPT/Claude
# Ask questions about architecture, bugs, improvements
```

### 3. Documentation Generation
```bash
# Compress with verbose output
comprax . -v -o docs/codebase-snapshot.txt

# Use output as reference for documentation
```

### 4. Project Snapshots
```bash
# Create timestamped snapshot
comprax . -c -o snapshots/project-$(date +%Y%m%d).txt
```

---

## ⚙️ Configuration Best Practices

### Recommended `.gitignore` Entries

```
Comprax outputs
comprax-output/
*.comprax.txt
.comprax-snapshot.txt
```

### Exclude Common Directories
Always exclude these for better compression:
```bash
comprax . -e \
  node_modules \
  .git \
  dist \
  build \
  coverage \
  .next \
  .cache
```

### Include Only Source Code
For maximum relevance:
```bash
comprax . -i .js .ts .jsx .tsx
```

---

## 📊 Output Structure Guide

### Directory Mode (Default)

```
comprax-output/
└── project-name/
├── _summary.txt          # Start here - project overview
├── src_components.txt    # All files in src/components/
├── src_utils.txt         # All files in src/utils/
└── bin.txt              # All files in bin/
```

**Best for:**
- Large projects (50+ files)
- Modular codebases
- Selective LLM analysis

### Combined Mode (`-c`)

```
project-compressed.txt        # Single file with all code
```

**Best for:**
- Small projects (<50 files)
- Quick analysis
- Single upload to LLM

---

## 🔧 Troubleshooting

### Issue: "No code files found"
**Cause:** All files filtered out or wrong directory

**Solution:**
```bash
# Check what's being filtered
comprax . -v

# Try including more extensions
comprax . -i .js .ts .jsx .tsx .mjs .cjs
```

### Issue: Compression too aggressive
**Cause:** Comments removed or code hard to read

**Solution:**
Currently, v1 uses smart compression by default. If you need raw code:
```bash
# Use directory mode and review individual files
comprax . -v
```

### Issue: Large file warnings
**Cause:** Files >5MB are skipped

**Solution:**
```bash
# Files are automatically skipped with warning in verbose mode
comprax . -v

# Check which files were skipped in output
```

### Issue: Permission errors
**Cause:** Can't read certain directories

**Solution:**
```bash
# Exclude problematic directories
comprax . -e restricted-folder -v
```

---

## 🎓 Tips & Tricks

### 1. Quick Project Analysis
```bash
# Compress only main source
comprax ./src -c | head -n 100

# Get quick overview
cat comprax-output/project/_summary.txt
```

### 2. Compare Compression Results
```bash
# Before
du -sh ./src

# Compress
comprax ./src -v

# After
du -sh comprax-output/
```

### 3. Extract Specific Module
```bash
# Compress only one directory
comprax ./src/auth -c -o auth-module.txt
```

### 4. Monitor Token Usage
```bash
# Comprax shows token estimate
comprax . -v
# Look for: "Estimated tokens saved: ~42,000"
```

---

## 📈 Performance Tips

### For Large Projects (1000+ files)
```bash
# Exclude test files
comprax . -e __tests__ tests spec -v

# Process only main source
comprax ./src ./lib -v
```

### For Faster Processing
```bash
# Include only necessary extensions
comprax . -i .js .ts

# Exclude heavy directories
comprax . -e node_modules dist build
```

---

## 🚀 Advanced Usage

### Custom Workflows

**1. Multi-stage Compression**
```bash
# Stage 1: Compress source
comprax ./src -o build/src.txt

# Stage 2: Compress tests separately
comprax ./tests -o build/tests.txt

# Stage 3: Combine manually or analyze separately
```

**2. Filtered Analysis**
```bash
# Only TypeScript files
comprax . -i .ts .tsx -o typescript-only.txt

# Only JavaScript files
comprax . -i .js .jsx -o javascript-only.txt
```

**3. Directory Comparison**
```bash
# Compress two versions
comprax ./v1 -c -o v1.txt
comprax ./v2 -c -o v2.txt

# Upload both to LLM and ask:
# "Compare these two versions and explain the differences"
```

---

## 🔮 Preparing for v2.0.0

v2 will include:
- Export detection
- Stack detection
- Project metadata
- Compression levels

**Current v1 output will remain compatible.**

To prepare:
1. Keep using v1 output format
2. Provide feedback on GitHub
3. Request features you need

---

## 📞 Support

- **GitHub Issues:** https://github.com/AjayBThorat-20/comprax/issues
- **Documentation:** https://github.com/AjayBThorat-20/comprax#readme
- **npm Package:** https://www.npmjs.com/package/comprax

---

## 📄 License

MIT © Ajay Thorat

---

Last updated: 2026-05-01
