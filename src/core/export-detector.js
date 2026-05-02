export function detectExports(code, filepath) {
  const exports = []
  
  // ES6: export function/const/class name
  const namedExportRegex = /export\s+(?:const|let|var|function|class)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g
  let match
  while ((match = namedExportRegex.exec(code)) !== null) {
    exports.push({ name: match[1], type: 'named' })
  }
  
  // ES6: export default
  if (/export\s+default/.test(code)) {
    const defaultMatch = code.match(/export\s+default\s+(?:function|class)?\s*([a-zA-Z_$][a-zA-Z0-9_$]*)?/)
    const name = defaultMatch && defaultMatch[1] ? defaultMatch[1] : 'default'
    exports.push({ name: name, type: 'default' })
  }
  
  // ES6: export { foo, bar }
  const exportListRegex = /export\s*\{\s*([^}]+)\s*\}/g
  while ((match = exportListRegex.exec(code)) !== null) {
    const names = match[1].split(',').map(n => n.trim().split(/\s+as\s+/)[0])
    names.forEach(name => {
      if (name) exports.push({ name: name, type: 'named' })
    })
  }
  
  // CommonJS: module.exports = { ... }
  const cjsObjectRegex = /module\.exports\s*=\s*\{([^}]+)\}/
  const cjsMatch = code.match(cjsObjectRegex)
  if (cjsMatch) {
    const names = cjsMatch[1].split(',').map(n => n.trim().split(':')[0])
    names.forEach(name => {
      if (name) exports.push({ name: name, type: 'commonjs' })
    })
  }
  
  // CommonJS: module.exports = value
  const cjsDirectRegex = /module\.exports\s*=\s*([a-zA-Z_$][a-zA-Z0-9_$]*)/
  const cjsDirectMatch = code.match(cjsDirectRegex)
  if (cjsDirectMatch && cjsDirectMatch[1] !== '{') {
    exports.push({ name: cjsDirectMatch[1], type: 'commonjs' })
  }
  
  // CommonJS: exports.name = value
  const cjsPropertyRegex = /exports\.([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/g
  while ((match = cjsPropertyRegex.exec(code)) !== null) {
    exports.push({ name: match[1], type: 'commonjs' })
  }
  
  // Deduplicate
  const seen = new Set()
  const unique = exports.filter(exp => {
    if (seen.has(exp.name)) return false
    seen.add(exp.name)
    return true
  })
  
  return unique
}

export function formatExports(exports) {
  if (!exports || exports.length === 0) return null
  return exports.map(e => e.name).join(', ')
}
