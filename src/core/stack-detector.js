import fs from "fs"
import path from "path"

/**
 * Detect project stack from package.json
 */
export function detectStack(projectPath) {
  const stack = {
    framework: null,
    runtime: 'Node.js',
    database: [],
    libraries: [],
    testing: [],
    build: []
  }

  try {
    const pkgPath = path.join(projectPath, 'package.json')
    if (!fs.existsSync(pkgPath)) {
      return stack
    }

    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
    const deps = {
      ...pkg.dependencies,
      ...pkg.devDependencies
    }

    // Detect framework
    if (deps.next) stack.framework = 'Next.js'
    else if (deps['@remix-run/react']) stack.framework = 'Remix'
    else if (deps.nuxt) stack.framework = 'Nuxt'
    else if (deps.gatsby) stack.framework = 'Gatsby'
    else if (deps.express) stack.framework = 'Express'
    else if (deps.fastify) stack.framework = 'Fastify'
    else if (deps.koa) stack.framework = 'Koa'
    else if (deps['@nestjs/core']) stack.framework = 'NestJS'
    else if (deps.react) stack.framework = 'React'
    else if (deps.vue) stack.framework = 'Vue'
    else if (deps.svelte) stack.framework = 'Svelte'
    else if (deps.angular) stack.framework = 'Angular'

    // Detect database
    if (deps.mongoose) stack.database.push('MongoDB')
    if (deps.pg || deps['pg-promise']) stack.database.push('PostgreSQL')
    if (deps.mysql || deps.mysql2) stack.database.push('MySQL')
    if (deps.redis) stack.database.push('Redis')
    if (deps.prisma || deps['@prisma/client']) stack.database.push('Prisma')
    if (deps['drizzle-orm']) stack.database.push('Drizzle')
    if (deps['better-sqlite3'] || deps.sqlite3) stack.database.push('SQLite')
    if (deps.mongodb) stack.database.push('MongoDB')

    // Detect libraries
    if (deps['@apollo/client'] || deps['apollo-server']) stack.libraries.push('Apollo GraphQL')
    if (deps.graphql) stack.libraries.push('GraphQL')
    if (deps['@trpc/server'] || deps['@trpc/client']) stack.libraries.push('tRPC')
    if (deps.zod) stack.libraries.push('Zod')
    if (deps['react-query'] || deps['@tanstack/react-query']) stack.libraries.push('React Query')
    if (deps.axios) stack.libraries.push('Axios')
    if (deps.lodash) stack.libraries.push('Lodash')
    if (deps.moment || deps.dayjs) stack.libraries.push(deps.moment ? 'Moment.js' : 'Day.js')

    // Detect testing
    if (deps.jest) stack.testing.push('Jest')
    if (deps.mocha) stack.testing.push('Mocha')
    if (deps.vitest) stack.testing.push('Vitest')
    if (deps.cypress) stack.testing.push('Cypress')
    if (deps.playwright) stack.testing.push('Playwright')

    // Detect build tools
    if (deps.webpack) stack.build.push('Webpack')
    if (deps.vite) stack.build.push('Vite')
    if (deps.rollup) stack.build.push('Rollup')
    if (deps.esbuild) stack.build.push('esbuild')
    if (deps.turbopack) stack.build.push('Turbopack')

    return stack
  } catch {
    return stack
  }
}

/**
 * Format stack for display
 */
export function formatStack(stack) {
  const lines = []

  if (stack.framework) {
    lines.push(`Framework: ${stack.framework}`)
  } else {
    lines.push(`Runtime: ${stack.runtime}`)
  }

  if (stack.database.length > 0) {
    lines.push(`Database: ${stack.database.join(', ')}`)
  }

  if (stack.libraries.length > 0) {
    lines.push(`Libraries: ${stack.libraries.slice(0, 5).join(', ')}${stack.libraries.length > 5 ? '...' : ''}`)
  }

  if (stack.testing.length > 0) {
    lines.push(`Testing: ${stack.testing.join(', ')}`)
  }

  if (stack.build.length > 0) {
    lines.push(`Build: ${stack.build.join(', ')}`)
  }

  return lines.join('\n')
}
