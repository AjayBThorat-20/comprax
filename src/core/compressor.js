function isImportantComment(text) {
  const keywords = ['TODO', 'FIXME', 'BUG', 'HACK', 'NOTE', 'IMPORTANT', 'WARNING']
  return keywords.some(kw => text.toUpperCase().includes(kw))
}

function isRedundantComment(text) {
  const redundant = [
    /^eslint-disable/,
    /^prettier-ignore/,
    /^@ts-ignore/,
    /^@ts-nocheck/,
    /^istanbul ignore/
  ]
  return redundant.some(pattern => pattern.test(text))
}

export function compress(code) {
  if (!code) return ''

  return code
    .replace(/\n+/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\s*([{}();,:])\s*/g, '$1')
    .trim()
}

export function calculateCompressionRatio(originalSize, compressedSize) {
  if (originalSize === 0) return 0
  return Math.round(((originalSize - compressedSize) / originalSize) * 100)
}
