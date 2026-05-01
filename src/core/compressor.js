/**
 * Smart compression that keeps comments readable for LLMs
 */
export function compress(code) {
  const lines = code.split('\n')
  const processed = []
  let inBlockComment = false
  let blockCommentLines = []

  for (let line of lines) {
    const trimmed = line.trim()

    // Handle block comment start
    if (trimmed.startsWith('/*')) {
      inBlockComment = true
      blockCommentLines = [trimmed]
      continue
    }

    // Handle block comment end
    if (inBlockComment) {
      blockCommentLines.push(trimmed)
      if (trimmed.includes('*/')) {
        inBlockComment = false
        // Convert multi-line block comment to single line
        const commentText = blockCommentLines
          .join(' ')
          .replace(/\/\*+\s*/g, '')
          .replace(/\s*\*+\//g, '')
          .replace(/\s*\*\s*/g, ' ')
          .trim()
        
        // Only keep if it's meaningful
        if (commentText && !isRedundantComment(commentText)) {
          processed.push(`// ${commentText}`)
        }
        blockCommentLines = []
      }
      continue
    }

    // Skip empty lines
    if (trimmed.length === 0) continue

    // Handle single-line comments
    if (trimmed.startsWith('//')) {
      const commentText = trimmed.substring(2).trim()
      
      // Keep important comments
      if (isImportantComment(commentText)) {
        processed.push(`// ${commentText}`)
      } else if (!isRedundantComment(commentText)) {
        processed.push(`// ${commentText}`)
      }
      continue
    }

    // Regular code line - remove indentation and extra spaces
    let codeLine = trimmed
    
    // Remove inline comments if they're redundant
    const inlineCommentMatch = codeLine.match(/^(.+?)\s*\/\/\s*(.+)$/)
    if (inlineCommentMatch) {
      const [, code, comment] = inlineCommentMatch
      if (isImportantComment(comment)) {
        codeLine = code.trim() + ' // ' + comment.trim()
      } else {
        codeLine = code.trim()
      }
    }

    processed.push(codeLine)
  }

  return processed.join('\n').trim()
}

/**
 * Check if comment contains important keywords
 */
function isImportantComment(text) {
  const important = [
    'TODO', 'FIXME', 'BUG', 'HACK', 'NOTE', 'IMPORTANT',
    'WARNING', 'DEPRECATED', 'SECURITY', 'PERFORMANCE',
    'XXX', 'OPTIMIZE', 'REFACTOR'
  ]
  
  const upper = text.toUpperCase()
  return important.some(keyword => upper.includes(keyword))
}

/**
 * Check if comment is redundant/auto-generated
 */
function isRedundantComment(text) {
  const redundant = [
    /^eslint-disable/i,
    /^prettier-ignore/i,
    /^@ts-ignore/i,
    /^@ts-nocheck/i,
    /^end of file/i,
    /^constructor$/i,
    /^imports?$/i,
    /^exports?$/i,
    /^file:/i,
    /^created by/i,
    /^author:/i,
    /^date:/i
  ]
  
  return redundant.some(pattern => pattern.test(text))
}

/**
 * Calculate compression ratio
 */
export function calculateCompressionRatio(original, compressed) {
  if (original === 0) return 0
  return Math.round(((original - compressed) / original) * 100)
}
