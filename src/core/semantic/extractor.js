export function extractStructure(ast) {
  const structure = {
    exports: [],
    functions: [],
    classes: [],
    imports: []
  }

  function visit(node) {
    if (!node || typeof node !== 'object') return

    // ESM: export named declarations
    if (node.type === 'ExportNamedDeclaration') {
      if (node.declaration) {
        if (node.declaration.type === 'FunctionDeclaration' && node.declaration.id) {
          structure.exports.push(node.declaration.id.name)
        } else if (node.declaration.type === 'ClassDeclaration' && node.declaration.id) {
          structure.exports.push(node.declaration.id.name)
        } else if (node.declaration.type === 'VariableDeclaration') {
          for (const decl of node.declaration.declarations) {
            if (decl.id && decl.id.type === 'Identifier') {
              structure.exports.push(decl.id.name)
            }
          }
        }
      } else if (node.specifiers) {
        for (const spec of node.specifiers) {
          if (spec.exported && spec.exported.name) {
            structure.exports.push(spec.exported.name)
          }
        }
      }
    }

    // ESM: export default
    if (node.type === 'ExportDefaultDeclaration') {
      if (node.declaration) {
        if (node.declaration.type === 'Identifier') {
          structure.exports.push(`default (${node.declaration.name})`)
        } else if (node.declaration.type === 'FunctionDeclaration' && node.declaration.id) {
          structure.exports.push(`default (${node.declaration.id.name})`)
        } else if (node.declaration.type === 'ClassDeclaration' && node.declaration.id) {
          structure.exports.push(`default (${node.declaration.id.name})`)
        } else {
          structure.exports.push('default')
        }
      }
    }

    // CommonJS: module.exports = ...
    if (node.type === 'AssignmentExpression' &&
        node.left &&
        node.left.type === 'MemberExpression' &&
        node.left.object &&
        node.left.object.name === 'module' &&
        node.left.property &&
        node.left.property.name === 'exports') {
      
      // module.exports = ClassName or new ClassName()
      if (node.right) {
        if (node.right.type === 'Identifier') {
          structure.exports.push(node.right.name)
        } else if (node.right.type === 'NewExpression' && node.right.callee) {
          const className = node.right.callee.name || 'default'
          structure.exports.push(className)
        } else if (node.right.type === 'ObjectExpression') {
          // module.exports = { foo, bar }
          for (const prop of node.right.properties) {
            if (prop.key && prop.key.name) {
              structure.exports.push(prop.key.name)
            }
          }
        }
      }
    }

    // CommonJS: exports.foo = ...
    if (node.type === 'AssignmentExpression' &&
        node.left &&
        node.left.type === 'MemberExpression' &&
        node.left.object &&
        node.left.object.name === 'exports' &&
        node.left.property) {
      structure.exports.push(node.left.property.name)
    }

    // Function declarations
    if (node.type === 'FunctionDeclaration' && node.id) {
      const params = node.params.map(p => {
        if (p.type === 'Identifier') return p.name
        if (p.type === 'RestElement' && p.argument && p.argument.type === 'Identifier') return '...' + p.argument.name
        if (p.type === 'AssignmentPattern' && p.left && p.left.type === 'Identifier') return p.left.name
        return '...'
      }).join(', ')
      
      structure.functions.push({
        name: node.id.name,
        params
      })
    }

    // Arrow functions and function expressions assigned to variables
    if (node.type === 'VariableDeclarator' && 
        node.id && node.id.type === 'Identifier' &&
        node.init && 
        (node.init.type === 'ArrowFunctionExpression' || node.init.type === 'FunctionExpression')) {
      
      const params = node.init.params.map(p => {
        if (p.type === 'Identifier') return p.name
        if (p.type === 'RestElement' && p.argument && p.argument.type === 'Identifier') return '...' + p.argument.name
        if (p.type === 'AssignmentPattern' && p.left && p.left.type === 'Identifier') return p.left.name
        return '...'
      }).join(', ')
      
      structure.functions.push({
        name: node.id.name,
        params
      })
    }

    // Class method declarations
    if (node.type === 'MethodDefinition' && node.key && node.key.name) {
      const params = node.value && node.value.params ? node.value.params.map(p => {
        if (p.type === 'Identifier') return p.name
        if (p.type === 'RestElement' && p.argument && p.argument.type === 'Identifier') return '...' + p.argument.name
        if (p.type === 'AssignmentPattern' && p.left && p.left.type === 'Identifier') return p.left.name
        return '...'
      }).join(', ') : ''
      
      structure.functions.push({
        name: node.key.name,
        params
      })
    }

    // Class declarations
    if (node.type === 'ClassDeclaration' && node.id) {
      structure.classes.push(node.id.name)
    }

    // Class expressions assigned to variables
    if (node.type === 'VariableDeclarator' && 
        node.id && node.id.type === 'Identifier' &&
        node.init && node.init.type === 'ClassExpression') {
      structure.classes.push(node.id.name)
    }

    // ESM: Import declarations
    if (node.type === 'ImportDeclaration' && node.source) {
      structure.imports.push(node.source.value)
    }

    // CommonJS: require() calls
    if (node.type === 'CallExpression' &&
        node.callee &&
        node.callee.name === 'require' &&
        node.arguments &&
        node.arguments[0] &&
        node.arguments[0].type === 'StringLiteral') {
      structure.imports.push(node.arguments[0].value)
    }

    // Traverse children
    for (const key in node) {
      if (key === 'loc' || key === 'range' || key === 'tokens' || key === 'comments') continue
      const child = node[key]
      if (Array.isArray(child)) {
        child.forEach(visit)
      } else if (child && typeof child === 'object') {
        visit(child)
      }
    }
  }

  visit(ast)

  // Deduplicate
  structure.exports = [...new Set(structure.exports)]
  structure.classes = [...new Set(structure.classes)]
  structure.imports = [...new Set(structure.imports)]

  return structure
}
