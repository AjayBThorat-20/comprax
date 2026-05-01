import path from "path"

const DEFAULT_ALLOWED_EXT = [".js", ".ts", ".jsx", ".tsx", ".mjs", ".cjs"]

const DEFAULT_IGNORED_DIRS = [
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  "coverage",
  ".turbo",
  ".cache",
  ".vercel",
  ".nuxt",
  "out",
  ".output",
  ".vscode",
  ".idea",
  "__pycache__",
  ".pytest_cache",
  "venv",
  ".env"
]

const IGNORED_FILES = [
  ".DS_Store",
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  "bun.lockb",
  ".gitignore",
  ".npmignore",
  ".eslintrc",
  ".prettierrc"
]

/**
 * Create filter function with custom options
 */
export function createFilter(options = {}) {
  const { exclude = [], include = [] } = options
  
  // Merge default and custom excluded directories
  const ignoredDirs = [...DEFAULT_IGNORED_DIRS, ...exclude]
  
  // Use custom extensions or defaults
  const allowedExt = include.length > 0 
    ? include.map(ext => ext.startsWith('.') ? ext : '.' + ext)
    : DEFAULT_ALLOWED_EXT

  return function shouldInclude(file) {
    const parts = file.split(path.sep)
    const fileName = path.basename(file)

    // Check if any part of path is ignored directory
    for (const dir of ignoredDirs) {
      if (parts.includes(dir)) {
        return false
      }
    }

    // Check if filename is ignored
    if (IGNORED_FILES.includes(fileName)) {
      return false
    }

    // Check extension
    const ext = path.extname(file)
    return allowedExt.includes(ext)
  }
}

/**
 * Get file extension for display
 */
export function getFileType(file) {
  const ext = path.extname(file)
  return ext.slice(1).toUpperCase() || "FILE"
}
