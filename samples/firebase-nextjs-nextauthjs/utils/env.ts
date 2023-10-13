// backend-only envs

const requiredEnvs: string[] = [
  'AUTH_JWT_SECRET',
  'PROVIDER_CLIENT_ID',
  'PROVIDER_CLIENT_SECRET',
  'PROVIDER_ISSUER',
]
const missingEnvs = requiredEnvs.filter((name) => !process.env[name])
if (missingEnvs.length !== 0) {
  throw new Error(
    `Required envs are not provided: ${missingEnvs.join(', ')}. Please check README file.`
  )
}

export const logLevel = process.env.LOG_LEVEL || 'info'
export const authJwtSecret = process.env.AUTH_JWT_SECRET!
export const providerClientId = process.env.PROVIDER_CLIENT_ID!
export const providerClientSecret = process.env.PROVIDER_CLIENT_SECRET!
export const providerIssuer = process.env.PROVIDER_ISSUER!
export const verifierApiUrl = process.env.VERIFIER_API_URL!
export const apiKeyHash = process.env.API_KEY_HASH!
