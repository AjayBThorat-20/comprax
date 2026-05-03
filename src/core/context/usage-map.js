export function buildUsageMap(graph) {
  const usage = {}
  
  Object.keys(graph).forEach(file => {
    graph[file].forEach(dep => {
      if (!usage[dep]) usage[dep] = []
      if (!usage[dep].includes(file)) {
        usage[dep].push(file)
      }
    })
  })
  
  return usage
}
