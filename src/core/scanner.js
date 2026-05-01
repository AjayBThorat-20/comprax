import fs from "fs"
import path from "path"

const MAX_DEPTH = 20
const visited = new Set()

/**
 * Recursively scan directory for all files
 * Handles symlinks and circular references
 */
export function scanDir(dir, depth = 0) {
  // Prevent infinite recursion
  if (depth > MAX_DEPTH) {
    console.warn(`⚠️  Max depth reached at: ${dir}`)
    return []
  }

  // Resolve real path (handles symlinks)
  let realPath
  try {
    realPath = fs.realpathSync(dir)
  } catch (err) {
    return [] // Can't access, skip
  }

  // Prevent circular references
  if (visited.has(realPath)) {
    return []
  }
  visited.add(realPath)

  let results = []

  try {
    const list = fs.readdirSync(dir)

    for (const file of list) {
      const fullPath = path.join(dir, file)

      let stat
      try {
        stat = fs.statSync(fullPath)
      } catch {
        continue // Can't stat, skip
      }

      if (stat.isDirectory()) {
        results = results.concat(scanDir(fullPath, depth + 1))
      } else if (stat.isFile()) {
        results.push(fullPath)
      }
    }
  } catch (err) {
    // Permission denied or other error
    return []
  }

  return results
}

/**
 * Reset scanner state for next scan
 */
export function resetScanner() {
  visited.clear()
}