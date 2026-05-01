import path from "path"

/**
 * Organize files by their directory structure
 * Returns a map of directory -> files
 */
export function organizeByDirectory(files, projectPath) {
  const organized = new Map()
  
  for (const file of files) {
    const relativePath = path.relative(projectPath, file.path)
    const dir = path.dirname(relativePath)
    
    // Use root-level filename for files in project root
    const key = dir === '.' ? '_root' : dir
    
    if (!organized.has(key)) {
      organized.set(key, [])
    }
    
    organized.get(key).push({
      ...file,
      relativePath
    })
  }
  
  return organized
}

/**
 * Get safe filename from directory path
 */
export function getSafeFilename(dirPath) {
  if (dirPath === '_root') {
    return 'root.txt'
  }
  
  // Replace path separators with underscores
  // src/commands -> src_commands.txt
  return dirPath.replace(/[\/\\]/g, '_') + '.txt'
}

/**
 * Create directory tree structure for display
 */
export function createTreeStructure(organized) {
  const dirs = Array.from(organized.keys()).sort()
  
  const tree = []
  tree.push('📁 Project Structure:')
  tree.push('')
  
  for (const dir of dirs) {
    const files = organized.get(dir)
    const filename = getSafeFilename(dir)
    const indent = dir.split(/[\/\\]/).length - 1
    const prefix = '  '.repeat(indent)
    
    if (dir === '_root') {
      tree.push(`${prefix}📄 ${filename} (${files.length} files)`)
    } else {
      tree.push(`${prefix}📁 ${dir}/ → ${filename} (${files.length} files)`)
    }
  }
  
  return tree.join('\n')
}
