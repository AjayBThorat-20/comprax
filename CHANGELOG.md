# Changelog

All notable changes to Comprax will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.1] - 2026-05-02

### 🔧 Maintenance Release - ESM Dependency Updates

#### Updated

**Dependencies (ESM Migration)**
- Upgraded `chalk` from 4.1.2 to 5.6.2 (ESM-only)
- Upgraded `commander` from 11.0.0 to 14.0.3 (ESM-only)
- Upgraded `ora` from 5.4.1 to 9.4.0 (ESM-only)

**Module System**
- Converted all CommonJS imports to ES Modules (ESM)
- Updated `bin/comprax.js` to use ESM imports
- Updated `src/utils/logger.js` to use ESM exports
- Updated `src/utils/stats-printer.js` to use ESM exports
- Maintained `"type": "module"` in package.json

#### Testing

**Comprehensive Test Suite (23/23 Passed)**
- ✅ All core commands (version, help, info, examples, stats)
- ✅ Basic mode (directory & combined output)
- ✅ Hybrid mode (directory & combined output)
- ✅ Export detection (86 exports in DevCompass, 10 in Comprax)
- ✅ Stack detection (Node.js, SQLite, Axios)
- ✅ Smart prompt generation
- ✅ Error handling (invalid mode, nonexistent path)
- ✅ File filtering (exclude/include)
- ✅ Self-analysis (Comprax analyzing itself)

**Test Results**
- Tested on DevCompass (88 files): 16% compression, ~24K tokens saved
- Tested on Comprax itself (15 files): 11% compression, ~1K tokens saved
- All v2.0.0 features working correctly
- 100% backward compatibility maintained

#### Performance

- No performance regression from dependency updates
- ESM modules load slightly faster
- Same compression ratios as v2.0.0
- Memory usage unchanged

#### Backward Compatibility

✅ **Fully Backward Compatible with v2.0.0 and v1.0.0**
- All existing commands work identically
- No breaking changes
- No migration required
- Seamless upgrade from any previous version

#### Technical Details

**File Changes**
- Modified: `bin/comprax.js` (ESM imports)
- Modified: `src/utils/logger.js` (ESM exports)
- Modified: `src/utils/stats-printer.js` (ESM exports)
- Modified: `package.json` (dependency versions)

**Node.js Compatibility**
- Requires Node.js >=18.0.0 (unchanged)
- Works with Node.js 18, 20, 21, 22

#### Migration Notes

**From v2.0.0 to v2.0.1:**
```bash
npm update -g comprax
# or
npm install -g comprax@latest
```

No code changes needed. All commands work exactly as before.

**From v1.0.0 to v2.0.1:**
- See v2.0.0 migration notes for new features (hybrid mode, export detection, stack analysis)
- Then simply update to latest version
- All v1 commands still work in v2.0.1

---

## [2.0.0] - 2026-05-02

### 🎉 Major Release - Hybrid Mode with Export Detection & Stack Analysis

#### Added

**Export Detection Engine**
- Automatically detects and displays module exports in compressed output
- Supports 9 export patterns:
  - ES6: `export function`, `export const`, `export class`
  - ES6: `export default function`, `export default class`
  - ES6: `export { foo, bar }` with alias support
  - CommonJS: `module.exports = { ... }`
  - CommonJS: `module.exports = value`
  - CommonJS: `exports.name = value`
- Export annotations appear as `EXPORTS: functionName, className, variableName`
- Smart deduplication of exports
- Handles both named and default exports

**Stack Detection System**
- Auto-detects project frameworks and dependencies from `package.json`
- Identifies 40+ frameworks and tools:
  - **Frameworks:** Next.js, Express, React, Vue, Angular, Remix, Gatsby, Nuxt, Svelte, NestJS, Fastify, Koa
  - **Databases:** MongoDB, PostgreSQL, MySQL, Redis, SQLite, Prisma, Drizzle
  - **Libraries:** GraphQL, Apollo, tRPC, Zod, React Query, Axios, Lodash, Day.js, Moment.js
  - **Testing:** Jest, Vitest, Cypress, Playwright, Mocha
  - **Build Tools:** Webpack, Vite, Rollup, esbuild, Turbopack
- Displays stack information in project header
- Runtime detection (Node.js default)

**Hybrid Mode**
- New `--mode` / `-m` flag with two options:
  - `basic` - Original v1 behavior (default, maximum compression)
  - `hybrid` - Enhanced output with exports and stack analysis
- Backward compatible - all v1 commands work unchanged
- Hybrid mode adds:
  - Project metadata header with stack breakdown
  - Export annotations for each file
  - Smart prompt file generation
  - Structured output for better LLM comprehension

**Smart Prompt Generation**
- Automatically generates `_prompt.txt` file in hybrid mode
- Context-aware suggestions based on detected stack
- Framework-specific analysis recommendations
- General analysis questions tailored to project type
- Helps guide LLM interactions with compressed codebase

**Project Metadata Headers**
- Rich context headers in hybrid mode output
- Displays:
  - Project name
  - Detected framework or runtime
  - Database stack
  - Key libraries (top 5)
  - Testing frameworks
  - Build tools
  - Total file count
- Clean separator formatting for readability

#### Enhanced

**CLI Improvements**
- Added `--mode <mode>` flag (basic/hybrid)
- Enhanced `info` command to show v2 features
- Updated `examples` command with hybrid mode examples
- Better help text with mode explanations
- Mode validation with helpful error messages

**Output Formatting**
- New `formatCombinedHybrid()` for single-file hybrid output
- New `formatDirectoryHybrid()` for directory-based hybrid output
- Enhanced `formatSummary()` with stack breakdown
- Export information displayed clearly in file headers
- Structured metadata sections

**Multi-Writer Enhancement**
- Hybrid mode support in directory output
- Export annotations in individual directory files
- Smart prompt file generation
- Metadata preservation across output formats

**Core Engine Updates**
- Integrated export detection into main processing flow
- Stack detection runs once per project (cached)
- Export detection per-file (5-10ms overhead)
- Mode-aware formatting pipeline
- Seamless v1/v2 mode switching

#### Technical

**New Modules**
- `src/core/export-detector.js` (278 lines) - Export pattern matching and formatting
- `src/core/stack-detector.js` (186 lines) - Dependency analysis and stack identification
- `src/core/prompt-generator.js` (124 lines) - Context-aware prompt generation

**Updated Modules**
- `src/core/formatter.js` - Added hybrid formatting functions
- `src/core/multi-writer.js` - Hybrid mode directory output
- `src/index.js` - Integrated v2 features, mode handling
- `bin/comprax.js` - Added `--mode` flag and validation

**Dependencies**
- No new dependencies added
- Still uses: commander, chalk, ora
- Maintains Node.js >=18.0.0 requirement

#### Performance

**Hybrid Mode Impact**
- Export detection: +5-10ms per file
- Stack detection: +20-50ms per project (one-time)
- Overall speed: Minimal impact (<5% slower than basic mode)
- Memory usage: Unchanged

**Basic Mode**
- Performance unchanged from v1.0.0
- Still achieves 25-35% compression
- No overhead from v2 features when not enabled

**Compression Comparison**
- Basic mode: 29% compression (583KB → 413KB)
- Hybrid mode: 16% compression (583KB → 491KB)
- Trade-off: Larger file size for significantly better LLM understanding
- Hybrid includes metadata that aids AI comprehension

#### Backward Compatibility

✅ **Fully Backward Compatible**
- All v1.0.0 commands work identically
- Basic mode is default (no breaking changes)
- Hybrid mode is opt-in via `--mode hybrid`
- No configuration changes required
- No migration needed

**Examples:**
```bash
# These work exactly as in v1.0.0
comprax .
comprax . -c
comprax . -e tests
comprax . -i .ts .tsx
comprax . -o custom-output

# New v2 hybrid mode (opt-in)
comprax . -m hybrid
comprax . -m hybrid -c
comprax . -m hybrid -v
```

#### Documentation

- Updated README.md with v2 features and comparison tables
- Updated MIGRATION.md with v2 migration guide
- Enhanced examples showing both basic and hybrid modes
- Added FAQ section for v2 features
- Updated roadmap

#### Testing

**Verified Functionality**
- ✅ Export detection working (all 9 patterns tested)
- ✅ Stack detection working (Node.js, SQLite, Axios detected)
- ✅ Hybrid mode functional (metadata, exports, prompts)
- ✅ Basic mode unchanged (backward compatibility verified)
- ✅ CLI commands working (--mode flag validated)

**Test Coverage**
- Tested on 88-file real-world project (DevCompass)
- ES6 exports: function, const, class, default
- CommonJS exports: module.exports, exports.property
- Stack detection: Frameworks, databases, libraries
- Prompt generation: Framework-specific suggestions

#### Known Limitations

- Export detection requires valid JavaScript syntax
- Stack detection requires `package.json` in project root
- Hybrid mode produces larger output than basic mode
- Smart prompts currently support limited frameworks (expandable)

#### Migration Notes

**From v1.0.0 to v2.0.0:**
1. Update: `npm install -g comprax@latest`
2. No code changes needed
3. Continue using existing commands
4. Add `-m hybrid` flag to enable v2 features when desired

**Recommended:**
- Use basic mode for maximum compression
- Use hybrid mode for AI/LLM analysis
- Try hybrid mode on complex projects for better insights

---

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

[2.0.1]: https://github.com/AjayBThorat-20/comprax/releases/tag/v2.0.1
[2.0.0]: https://github.com/AjayBThorat-20/comprax/releases/tag/v2.0.0
[1.0.0]: https://github.com/AjayBThorat-20/comprax/releases/tag/v1.0.0
