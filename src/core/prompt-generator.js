/**
 * Generate context-aware prompts for LLM analysis
 */
export function generatePrompt(stack, fileCount, projectName) {
  let prompt = `# ${projectName} - Compressed Codebase\n\n`
  
  prompt += `I've compressed this codebase for your analysis.\n\n`
  
  // Project context
  prompt += `## Project Context\n\n`
  if (stack.framework) {
    prompt += `- **Framework:** ${stack.framework}\n`
  } else {
    prompt += `- **Runtime:** ${stack.runtime}\n`
  }
  
  if (stack.database && stack.database.length > 0) {
    prompt += `- **Database:** ${stack.database.join(', ')}\n`
  }
  
  if (stack.libraries && stack.libraries.length > 0) {
    prompt += `- **Key Libraries:** ${stack.libraries.slice(0, 5).join(', ')}\n`
  }
  
  prompt += `- **Total Files:** ${fileCount}\n\n`
  
  // Framework-specific suggestions
  prompt += `## Suggested Analysis Tasks\n\n`
  
  if (stack.framework?.includes('Next')) {
    prompt += `**For Next.js projects:**\n`
    prompt += `- Analyze the routing structure and page components\n`
    prompt += `- Review API routes and data fetching patterns\n`
    prompt += `- Check for proper use of Server/Client Components\n`
    prompt += `- Identify performance optimization opportunities\n\n`
  } else if (stack.framework?.includes('Express') || stack.framework?.includes('Fastify')) {
    prompt += `**For ${stack.framework} backends:**\n`
    prompt += `- Map the API endpoints and middleware chain\n`
    prompt += `- Review authentication and authorization logic\n`
    prompt += `- Identify potential security vulnerabilities\n`
    prompt += `- Check error handling patterns\n\n`
  } else if (stack.framework?.includes('React')) {
    prompt += `**For React applications:**\n`
    prompt += `- Analyze component hierarchy and props flow\n`
    prompt += `- Review state management patterns\n`
    prompt += `- Check for performance anti-patterns\n`
    prompt += `- Identify reusable components\n\n`
  }
  
  if (stack.database?.includes('Prisma')) {
    prompt += `**For Prisma:**\n`
    prompt += `- Review the database schema design\n`
    prompt += `- Check query patterns for N+1 issues\n`
    prompt += `- Suggest query optimizations\n\n`
  }
  
  // General questions
  prompt += `## General Analysis Questions\n\n`
  prompt += `You can ask me to:\n`
  prompt += `- Explain the overall architecture and design patterns\n`
  prompt += `- Identify the main data flow through the application\n`
  prompt += `- Find potential bugs, security issues, or code smells\n`
  prompt += `- Suggest improvements, refactoring, or optimizations\n`
  prompt += `- Generate documentation for specific modules\n`
  prompt += `- Review error handling and edge cases\n`
  prompt += `- Analyze dependencies and suggest updates\n\n`
  
  prompt += `---\n\n`
  prompt += `**Ready to analyze!** Ask me anything about this codebase.\n`
  
  return prompt
}
