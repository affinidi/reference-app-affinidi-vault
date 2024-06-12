// public environment variables for frontend and backend

export const hostUrl = process.env.NEXT_PUBLIC_HOST!;
export const vaultUrl = process.env.NEXT_PUBLIC_VAULT_URL!; // TODO offer in TDK

export const queryId = process.env.NEXT_PUBLIC_QUERY_ID!;

if (!hostUrl || !vaultUrl)
  throw new Error(
    "NEXT_PUBLIC_HOST or NEXT_PUBLIC_VAULT_URL environment variable is undefined, please follow instructions in README to setup the application"
  );
