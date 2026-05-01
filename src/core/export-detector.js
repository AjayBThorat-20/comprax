/**
 * Detect exports in JavaScript/TypeScript files
 */
export function detectExports(code, filepath) {
  const exports = []

  // Pattern 1: export function functionName
  const namedFunctionPattern = /export\s+function\s+(\w+)/g
  let match
  while ((match = namedFunctionPattern.exec(code)) !== null) {
    exports.push({ name: match[1], type: 'function' })
  }

  // Pattern 2: export const/let/var name
  const namedConstPattern = /export\s+(?:const|let|var)\s+(\w+)/g
  while ((match = namedConstPattern.exec(code)) !== null) {
    exports.push({ name: match[1], type: 'variable' })
  }

  // Pattern 3: export class ClassName
  const namedClassPattern = /export\s+class\s+(\w+)/g
  while ((match = namedClassPattern.exec(code)) !== null) {
    exports.push({ name: match[1], type: 'class' })
  }

  // Pattern 4: export default function functionName
  const defaultFunctionMatch = code.match(/export\s+default\s+function\s+(\w+)/)
  if (defaultFunctionMatch && defaultFunctionMatch[1]) {
    exports.push({ name: defaultFunctionMatch[1], type: 'default', kind: 'function' })
  }

  // Pattern 5: export default class ClassName
  const defaultClassMatch = code.match(/export\s+default\s+class\s+(\w+)/)
  if (defaultClassMatch && defaultClassMatch[1]) {
    exports.push({ name: defaultClassMatch[1], type: 'default', kind: 'class' })
  }

  // Pattern 6: export { foo, bar }
  const namedExportsPattern = /export\s+{([^}]+)}/g
  while ((match = namedExportsPattern.exec(code)) !== null) {
    const names = match[1]
      .split(',')
      .map(n => {
        const parts = n.trim().split(/\s+as\s+/)
        return parts[0].trim()
      })
      .filter(n => n.length > 0)
    
    names.forEach(name => {
      exports.push({ name, type: 'named' })
    })
  }

  // Pattern 7: module.exports = { foo, bar }
  const commonJSMatch = code.match(/module\.exports\s*=\s*{([^}]+)}/)
  if (commonJSMatch && commonJSMatch[1]) {
    const names = commonJSMatch[1]
      .split(',')
      .map(n => n.trim().split(':')[0].trim())
      .filter(n => n.length > 0 && n !== '...')
    
    names.forEach(name => {
      exports.push({ name, type: 'commonjs' })
    })
  }

  // Pattern 8: module.exports = something
  const commonJSDirectMatch = code.match(/module\.exports\s*=\s*(\w+)/)
  if (commonJSDirectMatch && commonJSDirectMatch[1] && !commonJSMatch) {
    exports.push({ name: commonJSDirectMatch[1], type: 'commonjs', kind: 'direct' })
  }

  // Pattern 9: exports.functionName
  const exportsPropertyPattern = /exports\.(\w+)\s*=/g
  while ((match = exportsPropertyPattern.exec(code)) !== null) {
    exports.push({ name: match[1], type: 'commonjs-property' })
  }

  // Remove duplicates
  const unique = []
  const seen = new Set()
  
  for (const exp of exports) {
    const key = `${exp.name}-${exp.type}`
    if (!seen.has(key)) {
      seen.add(key)
      unique.push(exp)
    }
  }

  return unique
}

/**
 * Format exports for display
 */
export function formatExports(exports) {
  if (!exports || exports.length === 0) {
    return null
  }

  const parts = exports.map(exp => {
    if (exp.type === 'default') {
      return `default:${exp.name}`
    }
    return exp.name
  })

  return parts.join(', ')
}
