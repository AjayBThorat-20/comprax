# Changelog

All notable changes to Comprax will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-05-01

### 🎉 Initial Release

#### Added
- **Smart Compression Engine** - Reduces codebase size by 25-35% while preserving debugging context
- **Directory Organization** - Automatically organizes compressed files by folder structure
- **Combined Mode** - Option to create single combined file with `-c` flag
- **Flexible Filtering**
  - `--exclude` flag to skip specific directories
  - `--include` flag to process only specific file extensions
- **Comment Preservation** - Keeps TODO, FIXME, BUG, HACK, and other important comments
- **Token Estimation** - Estimates token savings for LLM context optimization
- **Compression Statistics** - Detailed analytics on compression results
- **Verbose Mode** - `-v` flag for detailed processing information
- **Custom Output Path** - `-o` flag to specify output location
- **Error Handling** - Robust handling of large files, permissions, and symlinks

#### Features
- Processes `.js`, `.ts`, `.jsx`, `.tsx`, `.mjs`, `.cjs` files
- Automatically excludes `node_modules`, `.git`, `dist`, `build`, etc.
- Preserves code structure and logic
- Symlink protection to prevent infinite loops
- Large file warnings (>5MB)
- Summary file generation with project overview

#### Technical
- Built with Node.js (>=18.0.0)
- ESM modules
- Dependencies: commander, chalk, ora
- Cross-platform support (Linux, macOS, Windows)

#### Tested
- Successfully compressed 88-file projects
- Achieved 29% compression on real-world codebase (583KB → 413KB)
- Saved ~42,000 tokens in testing
- Preserves all debugging context and comments

### Performance
- Average compression: 25-35%
- Processing speed: ~50-100 files/second
- Memory efficient: Processes files sequentially

### Known Limitations
- Text files only (no binary compression)
- Maximum file size: 5MB per file
- Requires Node.js 18 or higher

---

## [Upcoming in v2.0.0]

### Planned Features
- **Export Detection** - Automatically detect and display module exports
- **Stack Detection** - Identify project framework and dependencies
- **Project Metadata** - Add context headers with project information
- **Hybrid Format Mode** - Enhanced output with structural information
- **Compression Levels** - Multiple compression strategies (minimal/balanced/aggressive)
- **Incremental Mode** - Compress only changed files
- **Multi-language Support** - Add Python, Java, Go support

---

## Release Notes

### v1.0.0 - Production Ready

This is the first stable release of Comprax, ready for production use.

**Key Achievements:**
- ✅ 29% average compression
- ✅ Comments and context preserved
- ✅ Directory-based organization
- ✅ Real-world tested on 88-file projects
- ✅ ~42K token savings demonstrated

**Perfect for:**
- Preparing codebases for ChatGPT/Claude
- Code reviews and documentation
- Architecture analysis with LLMs
- Sharing compressed project snapshots

**Get Started:**
```bash
npm install -g comprax
comprax ./your-project
```

---

[1.0.0]: https://github.com/AjayBThorat-20/comprax/releases/tag/v1.0.0
