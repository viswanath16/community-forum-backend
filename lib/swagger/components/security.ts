/**
 * Security schemes and authentication components
 */

export const securitySchemes = {
  bearerAuth: {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    description: `
JWT Bearer token authentication. 

To authenticate:
1. Login via \`POST /api/auth/login\`
2. Copy the returned token
3. Include it in the Authorization header: \`Bearer YOUR_TOKEN\`

**Token expires in 7 days**
    `
  }
}

export const securityRequirements = [
  {
    bearerAuth: []
  }
]