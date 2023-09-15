// backend-only envs

const requiredEnvs: string[] = [
  'AUTH_JWT_SECRET',
  'AUTH0_CLIENT_ID',
  'AUTH0_CLIENT_SECRET',
  'AUTH0_ISSUER',
]
const missingEnvs = requiredEnvs.filter((name) => !process.env[name])
if (missingEnvs.length !== 0) {
  throw new Error(
    `Required envs are not provided: ${missingEnvs.join(', ')}. Please check README file.`
  )
}

export const logLevel = process.env.LOG_LEVEL || 'info'
export const authJwtSecret = process.env.AUTH_JWT_SECRET!
export const auth0ClientId = process.env.AUTH0_CLIENT_ID!
export const auth0ClientSecret = process.env.AUTH0_CLIENT_SECRET!
export const auth0Issuer = process.env.AUTH0_ISSUER!
export const centralApiGatewayUrl = process.env.CENTRAL_API_GATEWAY_URL