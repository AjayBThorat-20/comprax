/**
 * Estimate token count from text
 * Rough approximation: ~4 characters per token for code
 */
export function estimateTokens(text) {
  if (typeof text === 'number') {
    // Handle size in bytes
    return Math.ceil(text / 4)
  }
  return Math.ceil(text.length / 4)
}

/**
 * Format bytes to human readable
 */
export function formatBytes(bytes) {
  if (bytes < 1024) return bytes + " B"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  return (bytes / (1024 * 1024)).toFixed(1) + " MB"
}