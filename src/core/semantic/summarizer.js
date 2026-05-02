export function summarizeStructure(structure) {
  const lines = []

  // Exports
  if (structure.exports && structure.exports.length > 0) {
    lines.push(`Exports: ${structure.exports.join(', ')}`)
  }

  // Functions
  if (structure.functions && structure.functions.length > 0) {
    lines.push('')
    lines.push('Functions:')
    
    const displayCount = Math.min(structure.functions.length, 10)
    for (let i = 0; i < displayCount; i++) {
      const func = structure.functions[i]
      const name = typeof func === 'string' ? func : func.name
      const params = typeof func === 'object' && func.params ? func.params : ''
      lines.push(`  ${name}(${params})`)
    }
    
    if (structure.functions.length > 10) {
      lines.push(`  ... ${structure.functions.length - 10} more`)
    }
  }

  // Classes
  if (structure.classes && structure.classes.length > 0) {
    lines.push('')
    lines.push('Classes:')
    for (const cls of structure.classes) {
      const className = typeof cls === 'string' ? cls : cls.name || 'Unknown'
      lines.push(`  ${className}`)
    }
  }

  // Imports
  if (structure.imports && structure.imports.length > 0) {
    lines.push('')
    const count = structure.imports.length
    lines.push(`Imports: ${count} module${count === 1 ? '' : 's'}`)
  }

  return lines.join('\n')
}
