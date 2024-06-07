// public environment variables for frontend and backend

export const hostUrl = process.env.NEXT_PUBLIC_HOST!;
export const vaultUrl = process.env.NEXT_PUBLIC_VAULT_URL!; // TODO offer in TDK

if (!hostUrl || !vaultUrl)
  throw new Error(
    "NEXT_PUBLIC_HOST or NEXT_PUBLIC_VAULT_URL environment variable is undefined, please follow instructions in README to setup the application"
  );
