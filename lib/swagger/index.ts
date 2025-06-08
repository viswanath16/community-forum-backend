/**
 * Main Swagger configuration file
 * Combines all components and paths into a complete OpenAPI specification
 */

import { swaggerConfig } from './config'
import { securitySchemes } from './components/security'
import { schemas } from './components/schemas'
import { parameters } from './components/parameters'
import { responses } from './components/responses'
import { examples } from './components/examples'
import { authPaths } from './paths/auth'
import { eventPaths } from './paths/events'
import { marketplacePaths } from './paths/marketplace'
import { userPaths } from './paths/users'

export const swaggerSpec = {
  ...swaggerConfig,
  components: {
    securitySchemes,
    schemas,
    parameters,
    responses,
    examples
  },
  paths: {
    ...authPaths,
    ...eventPaths,
    ...marketplacePaths,
    ...userPaths
  }
}

export default swaggerSpec