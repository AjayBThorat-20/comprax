const CHARS_PER_TOKEN = 4

export function estimateTokens(text) {
  if (!text) return 0
  return Math.ceil(text.length / CHARS_PER_TOKEN)
}

export function formatTokenCount(count) {
  return count.toLocaleString()
}
