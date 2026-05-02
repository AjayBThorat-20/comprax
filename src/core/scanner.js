import fs from "fs"
import path from "path"

const DEFAULT_EXCLUDE = [
  'node_modules',
  '.git',
  'dist',
  'build',
  '.next',
  'out',
  'coverage',
  '.cache',
  '.vscode',
  '.idea',
  '__pycache__',
  '.pytest_cache',
  'venv',
  'env'
]

const DEFAULT_EXTENSIONS = ['.js', '.ts', '.jsx', '.tsx', '.mjs', '.cjs']

let scannerState = {
  totalFiles: 0
}

export function resetScanner() {
  scannerState.totalFiles = 0
}

export function scanDir(dir, depth = 0, visited = new Set()) {
  const files = []
  
  // CRITICAL FIX: Prevent infinite loops from symlinks with error handling
  let realPath
  try {
    realPath = fs.realpathSync(dir)
  } catch (err) {
    // Skip broken symlinks
    return files
  }
  
  if (visited.has(realPath)) {
    return files
  }
  visited.add(realPath)
  
  // Safety: max depth
  if (depth > 10) {
    return files
  }
  
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      
      // Skip excluded directories
      if (entry.isDirectory() && DEFAULT_EXCLUDE.includes(entry.name)) {
        continue
      }
      
      // CRITICAL FIX: Only skip hidden directories, not files
      if (entry.isDirectory() && entry.name.startsWith('.')) {
        continue
      }
      
      if (entry.isDirectory()) {
        // Recurse with visited set
        files.push(...scanDir(fullPath, depth + 1, visited))
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name)
        if (DEFAULT_EXTENSIONS.includes(ext)) {
          files.push(fullPath)
          scannerState.totalFiles++
        }
      }
    }
  } catch (err) {
    // Skip directories we can't read
  }
  
  return files
}

export function getTotalFiles() {
  return scannerState.totalFiles
}
