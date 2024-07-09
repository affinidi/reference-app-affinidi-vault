// Required envs for Affinidi Login
const requiredEnvs: string[] = [
  "NEXTAUTH_URL",
  "NEXTAUTH_SECRET",
  "PROVIDER_CLIENT_ID",
  "PROVIDER_CLIENT_SECRET",
  "PROVIDER_ISSUER",
];
const missingEnvs = requiredEnvs.filter((name) => !process.env[name]);
if (missingEnvs.length !== 0) {
  throw new Error(
    `Required environment secrets are not provided: ${missingEnvs.join(
      ", ",
    )}. Please check README file.`,
  );
}

export const providerClientId = process.env.PROVIDER_CLIENT_ID!;
export const providerClientSecret = process.env.PROVIDER_CLIENT_SECRET!;
export const providerIssuer = process.env.PROVIDER_ISSUER!;

// Optional envs for credential issuance and Affinidi Iota Framework
export const projectId = process.env.PROJECT_ID!;
export const tokenId = process.env.TOKEN_ID!;
export const privateKey = process.env.PRIVATE_KEY!;
export const passphrase = process.env.PASSPHRASE!;

export function personalAccessTokenConfigured(): boolean {
  return (
    projectId !== undefined && tokenId !== undefined && privateKey !== undefined
  );
}
