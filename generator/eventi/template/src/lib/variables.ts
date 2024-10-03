// public environment variables for frontend and backend

export const hostUrl = process.env.NEXT_PUBLIC_HOST!;

export const iotaConfigId = process.env.NEXT_PUBLIC_IOTA_CONFIG_ID!;
export const recommendationIota = process.env.NEXT_PUBLIC_IOTA_MUSIC_RECOMMEND_QUERY!;
export const addressIota = process.env.NEXT_PUBLIC_IOTA_ADDRESS_QUERY!;
export const eventTicketQuery = process.env.NEXT_PUBLIC_IOTA_EVENT_TICKET_QUERY!;

if (!hostUrl)
  throw new Error(
    "NEXT_PUBLIC_HOST environment variable is undefined, please follow instructions in README to setup the application"
  );

 
