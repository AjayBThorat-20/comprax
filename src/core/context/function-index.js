export function buildFunctionIndex(fileData) {
  const index = []
  
  fileData.forEach(file => {
    if (file.structure?.functions) {
      file.structure.functions.forEach(fn => {
        if (!fn.name) return
        
        // FIX 2: Convert params array to string
        const params = Array.isArray(fn.params) ? fn.params.join(", ") : (fn.params || "")
        
        index.push({
          name: fn.name,
          params: params,
          file: file.path
        })
      })
    }
  })
  
  // Sort by name for deterministic output
  index.sort((a, b) => a.name.localeCompare(b.name))
  
  return index
}
