// shared envs for frontend and backend

export const hostUrl = process.env.NEXT_PUBLIC_HOST!
export const hideDataSharingBanner = process.env.NEXT_PUBLIC_HIDE_DATA_SHARING_BANNER === "true"
export const showConnectorSelection = process.env.NEXT_PUBLIC_SHOW_CONNECTOR_SELECTION === "true"

if (!hostUrl)
  throw new Error('NEXT_PUBLIC_HOST environment variable is undefined, please follow instructions in README to setup the application')
  