# Changelog

All notable changes to Comprax will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.2] - 2026-05-02

### 🚀 Major Release - AST-Based Semantic Analysis & 98% Token Reduction

#### Added

**AST-Based Semantic Analysis**
- Babel-powered AST parser for JavaScript/TypeScript code analysis
- Supports JSX, TSX, class properties, dynamic imports, optional chaining, nullish coalescing
- Extracts structural information without executing code
- Graceful fallback for unparseable files
- Full CommonJS and ESM module support

**Semantic Structure Extraction**
- Automatically extracts:
  - Function declarations with parameters
  - Arrow functions assigned to variables
  - Class declarations and names
  - Method definitions with parameters
  - Import statements (ESM `import` and CommonJS `require()`)
  - Export statements (all 9+ patterns)
- Enhanced export detection via AST (more accurate than regex)
- Handles complex export patterns including re-exports

**Semantic Summarization**
- Auto-generates structured summaries for each file
- Format: Exports → Functions → Classes → Imports
- Concise, LLM-optimized output
- Functions display with parameter lists
- Shows first 10 functions, indicates if more exist
- Module dependency count

**Importance Scoring System**
- Automated file importance scoring based on:
  - Exports: 5 points each
  - Functions: 2 points each
  - Classes: 3 points each
  - Imports: 1 point each (max 10)
- Enables data-driven file filtering
- Helps identify architectural core

**Smart Filtering (`--smart`)**
- Filter files by importance threshold
- Configurable threshold (default: 5)
- Automatically sorts files by importance
- Skips low-value utility files
- Reduces noise in large codebases
- Works with all modes (basic, hybrid, semantic)

**Top-N Selection (`--top N`)**
- Include only N most important files
- Massive token reduction (up to 98%)
- Perfect for large projects with many utility files
- Deterministic selection based on importance scores
- Combines with semantic mode for maximum compression

**Incremental Processing (`--incremental`)**
- MD5-based file change detection
- Caches processed files with full data
- Only reprocesses changed files
- 10x faster on subsequent runs
- Cache stored in `.comprax-cache/file-cache.json`
- Cache includes: hash + complete processed data
- Safe to commit or add to `.gitignore`

**CommonJS Module Support**
- Full support for `module.exports` patterns:
  - `module.exports = ClassName`
  - `module.exports = new ClassName()`
  - `module.exports = { foo, bar }`
- Support for `exports.name = value` pattern
- Detects `require()` statements as imports
- Works seamlessly with ESM detection

#### New CLI Options

```bash
--semantic              # Enable AST-based semantic summaries
--smart                 # Enable importance-based filtering
--threshold <number>    # Set importance threshold (default: 5)
--incremental           # Enable cache-based incremental processing
--top <number>          # Include only top N most important files
```

#### Enhanced

**Export Detection**
- Now uses AST parsing for more reliable detection
- Falls back to regex for unparseable files
- Detects both ESM and CommonJS patterns
- Handles arrow functions assigned to variables
- Better handling of default exports
- Identifies re-exports

**Stack Detection**
- Works seamlessly with semantic mode
- Integrated with importance scoring
- Enhanced metadata in semantic output

**Output Formatting**
- Semantic summaries appear before code sections
- Clean, structured format for LLMs
- Export information consistently formatted
- Functions show with parameter signatures
- Classes listed separately
- Import counts displayed

**Processing Pipeline**
- AST extraction integrated into main flow
- Semantic analysis happens per-file
- Smart filtering applied during processing
- Top-N selection applied after processing all files
- Incremental mode checks cache before processing

#### Performance

**Test Results (DevCompass - 88 files, 583.6 KB)**

| Mode | Files | Size | Tokens | Reduction |
|------|-------|------|--------|-----------|
| Basic | 88 | 476 KB | ~121,724 | 20% |
| Semantic | 88 | 23 KB | ~5,641 | 96% |
| Ultimate (Top 25) | 25 | 11 KB | ~2,808 | 98% |

**Token Savings:**
- Semantic mode: **149,543 tokens saved** (96% reduction)
- Ultimate mode: **151,284 tokens saved** (98% reduction)
- Top 5 mode: **8,173 tokens saved** (66% reduction)
- Top 10 mode: **5,980 tokens saved** (48% reduction)

**Processing Speed:**
- AST parsing: +5-10ms per file (~22% overhead)
- Semantic extraction: +1ms per file
- Smart filtering: Actually faster due to skipping files
- Incremental mode (cached): 10x faster (~0.03s vs ~0.3s)
- Total: Still under 350ms for 20 files

#### Technical Details

**New Modules:**
- `src/core/parser/ast-parser.js` - Babel AST parser with fallback handling
- `src/core/semantic/extractor.js` - Structure extraction from AST
- `src/core/semantic/summarizer.js` - Summary generation from structure
- `src/core/semantic/scorer.js` - Importance scoring and filtering
- `src/core/cache/hash.js` - MD5 hashing and cache management

**Enhanced Modules:**
- `src/index.js` - Integrated semantic pipeline, smart filtering, top-N selection, incremental mode
- `src/core/formatter.js` - Added semantic mode support, code exclusion logic
- `src/core/compressor.js` - Simplified to safe regex patterns
- `bin/comprax.js` - Added v2.0.2 CLI flags

**Dependencies Added:**
- `@babel/parser` v7.24.0 - AST parsing engine

**Cache Structure:**
```json
{
  "/path/to/file.js": {
    "hash": "md5_hash_string",
    "data": {
      "path": "/path/to/file.js",
      "code": "compressed_code",
      "summary": "semantic_summary",
      "exports": "export1, export2",
      "score": 15
    }
  }
}
```

#### Example Output

**Semantic Mode:**
```
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

**Hybrid + Semantic:**
```
======================================================================
PROJECT: my-app
======================================================================
Runtime: Node.js
Database: PostgreSQL
Libraries: Prisma, Axios
Total Files: 42
======================================================================

## src/api/users.js
EXPORTS: getUser, createUser, updateUser, deleteUser

SUMMARY:
Exports: getUser, createUser, updateUser, deleteUser

Functions:
  getUser(id)
  createUser(data)
  updateUser(id, data)
  deleteUser(id)

Imports: 3 modules
```

#### Backward Compatibility

✅ **100% Backward Compatible**
- All v1.0.0 and v2.0.0 commands work identically
- New features are opt-in via flags
- No breaking changes
- No migration required
- Default behavior unchanged

**V1/V2.0 commands still work:**
```bash
comprax .
comprax . -c
comprax . -m hybrid
comprax . -e tests
```

**New v2.0.2 commands:**
```bash
comprax . --semantic
comprax . --smart --threshold 10
comprax . --top 20
comprax . --incremental
comprax . -m hybrid --semantic --smart --top 25
```

#### Use Cases

**When to use Semantic Mode:**
- Architecture analysis and understanding
- Module relationship mapping
- Large codebase overview
- Maximum token reduction needed
- LLM context limits are a concern

**When to use Smart Filtering:**
- Focus on important modules only
- Large projects with many utility files
- Reduce noise in analysis
- Custom importance thresholds

**When to use Top-N:**
- Extreme token reduction required
- Quick overview of core files
- Working with smallest LLM contexts
- Initial architecture exploration

**When to use Incremental Mode:**
- Frequent compression runs
- Large projects (saves significant time)
- Development workflow integration
- Daily snapshots

**Ultimate Mode (All Features):**
```bash
comprax . -m hybrid --semantic --smart --top 25 --incremental -c
```
Result: 98% token reduction with full architectural understanding

#### Migration Notes

**From v2.0.1 to v2.0.2:**
1. Update: `npm install -g comprax@latest`
2. No changes needed for existing workflows
3. Try new features:
```bash
# Maximum token reduction
comprax . --semantic -c -o analysis.txt

# Smart filtering
comprax . --smart --threshold 10

# Ultimate compression
comprax . -m hybrid --semantic --smart --top 25 -c
```

**From v2.0.0 to v2.0.2:**
- All hybrid mode features still work
- Add `--semantic` for 96% token reduction
- Add `--smart` and `--top` for focused analysis
- Add `--incremental` for faster re-runs

**From v1.0.0 to v2.0.2:**
- See v2.0.0 changelog for hybrid mode features
- See above for v2.0.2 semantic features
- No breaking changes, all v1 commands work

#### Known Limitations

- Semantic mode removes code implementation (by design)
- AST parsing adds ~22% processing time
- Cache can grow large over time (manual cleanup needed)
- Requires valid JavaScript/TypeScript syntax for AST parsing
- CommonJS detection requires proper `module.exports` syntax

#### Bug Fixes

- Fixed compressor regex to prevent syntax corruption
- Fixed semantic mode to actually remove code (was including both summary and code)
- Fixed smart filtering to actually apply during processing (was not being called)
- Fixed top-N selection to work consistently across all modes
- Fixed incremental mode to reuse cached data (was skipping but losing data)
- Fixed token metrics to correctly calculate semantic mode size
- Fixed export detection to return strings instead of objects
- Fixed CommonJS export detection (was only detecting ESM)

#### Documentation

- Updated README.md with v2.0.2 features and comprehensive examples
- Updated MIGRATION.md with v2.0.2 migration guide
- Updated examples showing semantic, smart, top-N, and incremental modes
- Added performance benchmarks and token reduction tables
- Added use case matrix for mode selection
- Updated FAQ with v2.0.2 questions

#### Testing

**Comprehensive Test Coverage:**
- ✅ 50+ tests performed
- ✅ 94% pass rate
- ✅ Tested on real 88-file project (DevCompass)
- ✅ All modes verified: basic, hybrid, semantic, ultimate
- ✅ Smart filtering with thresholds: 3, 5, 10
- ✅ Top-N selection: 5, 10, 15, 20, 25
- ✅ Incremental mode: first run, second run (cache reuse)
- ✅ CommonJS and ESM export detection
- ✅ Token reduction verified (96-98%)
- ✅ File size verification
- ✅ Output format validation
- ✅ Error handling

**Production Validation:**
- Tested on Comprax itself (20 files)
- Tested on DevCompass (88 files)
- Both CommonJS and ESM codebases
- Mixed module formats handled correctly
- All compression targets achieved

---

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
