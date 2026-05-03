import path from "path"

export function buildDependencyGraph(fileData, root) {
  const graph = {}
  
  fileData.forEach(file => {
    const imports = file.structure?.imports || []
    graph[file.path] = imports
      .map(i => resolveImport(file.path, i, root))
      .filter(Boolean)
  })
  
  return graph
}

function resolveImport(filePath, importPath, root) {
  // Skip node_modules and absolute imports
  if (!importPath.startsWith(".")) return null
  
  const dir = path.dirname(filePath)
  let resolved = path.resolve(dir, importPath)
  
  // Try common extensions
  const extensions = [".js", ".ts", ".jsx", ".tsx", ".mjs", ".cjs"]
  
  for (const ext of extensions) {
    if (resolved.endsWith(ext)) {
      return normalize(resolved, root)
    }
  }
  
  // Try adding extensions
  for (const ext of extensions) {
    const withExt = resolved + ext
    return normalize(withExt, root)
  }
  
  return normalize(resolved, root)
}

function normalize(absPath, root) {
  return absPath.replace(root + "/", "")
}
