export function detectRoles(fileData) {
  const roles = {}
  
  fileData.forEach(file => {
    roles[file.path] = detectRole(file.path)
  })
  
  return roles
}

function detectRole(filePath) {
  const p = filePath.toLowerCase()
  
  // FIX 3: More comprehensive role patterns
  
  // Layer patterns (most specific first)
  if (p.includes("controller")) return "controller layer"
  if (p.includes("route") || p.includes("router")) return "routing layer"
  if (p.includes("middleware")) return "middleware"
  if (p.includes("service")) return "business logic"
  if (p.includes("repository") || p.includes("repo")) return "data access layer"
  
  // Domain patterns
  if (p.includes("auth")) return "authentication module"
  if (p.includes("db") || p.includes("database")) return "database module"
  if (p.includes("model")) return "data model"
  if (p.includes("schema")) return "schema definition"
  if (p.includes("validator") || p.includes("validation")) return "validation logic"
  
  // Infrastructure patterns
  if (p.includes("config")) return "configuration"
  if (p.includes("util") || p.includes("helper")) return "utility functions"
  if (p.includes("logger") || p.includes("logging")) return "logging utility"
  if (p.includes("cache")) return "caching layer"
  if (p.includes("queue")) return "queue handler"
  
  // Testing patterns
  if (p.includes("test") || p.includes("spec")) return "test suite"
  if (p.includes("mock")) return "test mocks"
  
  // Generic fallback
  return "application module"
}
