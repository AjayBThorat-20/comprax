import path from "path"

export function formatCombined(fileData, basePath) {
  const projectName = path.basename(basePath)
  let output = ""
  
  output += "=".repeat(70) + "\n"
  output += `PROJECT: ${projectName}\n`
  output += "=".repeat(70) + "\n\n"

  for (const file of fileData) {
    const relativePath = path.relative(basePath, file.path)
    output += `## ${relativePath}\n`
    output += file.code.trim() + "\n\n"
  }

  return output
}

export function formatCombinedHybrid(fileData, basePath, stack, projectName, semantic = false) {
  let output = ""
  
  output += "=".repeat(70) + "\n"
  output += `PROJECT: ${projectName}\n`
  output += "=".repeat(70) + "\n"
  
  if (stack) {
    if (stack.framework) {
      output += `Framework: ${stack.framework}\n`
    } else {
      output += `Runtime: ${stack.runtime}\n`
    }
    
    if (stack.database.length > 0) {
      output += `Database: ${stack.database.join(", ")}\n`
    }
    
    if (stack.libraries.length > 0) {
      output += `Libraries: ${stack.libraries.slice(0, 5).join(", ")}\n`
    }
  }
  
  output += `Total Files: ${fileData.length}\n`
  output += "=".repeat(70) + "\n\n"

  for (const file of fileData) {
    const relativePath = path.relative(basePath, file.path)
    output += `## ${relativePath}\n`
    
    if (file.exports) {
      output += `EXPORTS: ${file.exports}\n`
    }
    
    // CRITICAL FIX: Always include code, optionally add summary first
    if (semantic && file.summary) {
      output += `\nSUMMARY:\n${file.summary}\n\n`
    }
    
    output += file.code.trim() + "\n\n"
  }

  return output
}

export function formatDirectory(files, dirName) {
  let output = ""
  
  for (const file of files) {
    const fileName = path.basename(file.path)
    output += `## ${fileName}\n`
    output += file.code.trim() + "\n\n"
  }
  
  return output
}

export function formatDirectoryHybrid(files, dirName, semantic = false) {
  let output = ""
  
  for (const file of files) {
    const fileName = path.basename(file.path)
    output += `## ${fileName}\n`
    
    if (file.exports) {
      output += `EXPORTS: ${file.exports}\n`
    }
    
    // CRITICAL FIX: Always include code, optionally add summary first
    if (semantic && file.summary) {
      output += `\nSUMMARY:\n${file.summary}\n\n`
    }
    
    output += file.code.trim() + "\n\n"
  }
  
  return output
}

export function formatSummary(organized, stats, stack, projectName) {
  let output = ""
  
  output += "=".repeat(70) + "\n"
  output += "COMPRAX COMPRESSION SUMMARY\n"
  output += "=".repeat(70) + "\n\n"
  
  output += `Project: ${projectName}\n`
  output += `Generated: ${new Date().toISOString()}\n`
  output += `Total Files: ${stats.totalFiles}\n`
  output += `Total Directories: ${organized.size}\n`
  
  const originalKB = (stats.originalSize / 1024).toFixed(1)
  const compressedKB = (stats.compressedSize / 1024).toFixed(1)
  
  output += `Original Size: ${originalKB} KB\n`
  output += `Compressed Size: ${compressedKB} KB\n`
  output += `Reduction: ${stats.savedPercent}%\n\n`
  
  if (stack) {
    output += "=".repeat(70) + "\n"
    output += "PROJECT STACK\n"
    output += "=".repeat(70) + "\n"
    
    if (stack.framework) {
      output += `Framework: ${stack.framework}\n`
    } else {
      output += `Runtime: ${stack.runtime}\n`
    }
    
    if (stack.database.length > 0) {
      output += `Database: ${stack.database.join(", ")}\n`
    }
    
    if (stack.libraries.length > 0) {
      output += `Libraries: ${stack.libraries.join(", ")}\n`
    }
    
    output += "\n"
  }
  
  output += "=".repeat(70) + "\n"
  output += "DIRECTORY BREAKDOWN\n"
  output += "=".repeat(70) + "\n\n"
  
  for (const [dirName, files] of organized) {
    const dirSize = files.reduce((sum, f) => sum + (f.compressedSize || f.code.length), 0)
    const sizeKB = (dirSize / 1024).toFixed(1)
    
    output += `📁 ${dirName}\n`
    output += `   Files: ${files.length}\n`
    output += `   Size: ${sizeKB} KB\n\n`
  }
  
  return output
}
