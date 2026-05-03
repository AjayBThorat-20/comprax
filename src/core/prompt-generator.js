export function generatePrompt(stack, fileCount, projectName) {
  let prompt = ""
  
  // Simple analysis suggestions based on stack
  prompt += `ANALYSIS SUGGESTIONS FOR ${projectName.toUpperCase()}\n\n`
  
  if (stack) {
    if (stack.framework) {
      prompt += `This is a ${stack.framework} project.\n`
    } else if (stack.runtime) {
      prompt += `This is a ${stack.runtime} project.\n`
    }
    
    if (stack.database && stack.database.length > 0) {
      prompt += `Database: ${stack.database.join(", ")}\n`
    }
  }
  
  prompt += `\nTotal files: ${fileCount}\n\n`
  prompt += `SUGGESTED ANALYSIS:\n`
  prompt += `- Review architecture and module organization\n`
  prompt += `- Check for code duplication opportunities\n`
  prompt += `- Analyze dependencies and relationships\n`
  
  return prompt
}

// New optimized version for LLM control
export function generateControlledPrompt({ projectName, stack, contextText, userTask }) {
  let prompt = ""
  
  // =============================
  // SYSTEM INTENT
  // =============================
  prompt += `Modify existing codebase without breaking structure.\n`
  prompt += `Reuse existing functions. Avoid duplication.\n\n`
  
  // =============================
  // PROJECT
  // =============================
  prompt += `## PROJECT\n${projectName}\n`
  if (stack?.framework) {
    prompt += `${stack.framework}\n`
  } else if (stack?.runtime) {
    prompt += `${stack.runtime}\n`
  }
  if (stack?.database?.length) {
    prompt += `${stack.database.join(", ")}\n`
  }
  prompt += `\n`
  
  // =============================
  // CONTEXT
  // =============================
  prompt += `## CONTEXT\n${contextText}\n`
  
  // =============================
  // RULES
  // =============================
  prompt += `## RULES\n`
  prompt += `- No renaming\n`
  prompt += `- No duplicate logic\n`
  prompt += `- Reuse FUNCTION INDEX\n`
  prompt += `- Modify minimal files\n`
  prompt += `- Respect dependencies\n\n`
  
  // =============================
  // PLAN STEP
  // =============================
  prompt += `## PLAN FIRST\n`
  prompt += `List files, reused functions, changes.\n\n`
  
  // =============================
  // OUTPUT FORMAT
  // =============================
  prompt += `## OUTPUT\n`
  prompt += `PLAN:\nFILES:\nREUSE:\nNEW:\n`
  prompt += `CHANGES:\n`
  prompt += `CODE:\n\n`
  
  // =============================
  // TASK
  // =============================
  prompt += `## TASK\n${userTask}\n`
  
  return prompt
}
