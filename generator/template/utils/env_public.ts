// shared envs for frontend and backend

export const hostUrl = process.env.NEXT_PUBLIC_HOST!
export const socialConnectorName = process.env.NEXT_PUBLIC_SOCIAL_CONNECTOR_NAME!

if (!hostUrl)
  throw new Error('NEXT_PUBLIC_HOST environment variable is undefined, please follow instructions in README to setup the application')
