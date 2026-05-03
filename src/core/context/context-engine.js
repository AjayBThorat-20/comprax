import { buildDependencyGraph } from "./dependency-graph.js"
import { buildFunctionIndex } from "./function-index.js"
import { detectRoles } from "./role-detector.js"
import { buildUsageMap } from "./usage-map.js"

export function buildContext(fileData, rootPath) {
  const graph = buildDependencyGraph(fileData, rootPath)
  const functionIndex = buildFunctionIndex(fileData)
  const fileRoles = detectRoles(fileData)
  const usageMap = buildUsageMap(graph)
  
  return {
    graph,
    functionIndex,
    fileRoles,
    usageMap
  }
}
