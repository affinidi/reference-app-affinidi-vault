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
      ", "
    )}. Please check README file.`
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
export const keyId = process.env.KEY_ID!;

// Optional envs for a second, non-Affinidi login provider (Auth0) used as authN
// for the websocket flow when the holder is NOT using Affinidi Vault (e.g. the
// TDK Vault). Optional so the app still runs with only Affinidi Login.
// TODO: swap these for any OIDC IdP (Keycloak, etc.) — no code change needed.
export const auth0Issuer = process.env.AUTH0_ISSUER;
export const auth0ClientId = process.env.AUTH0_CLIENT_ID;
export const auth0ClientSecret = process.env.AUTH0_CLIENT_SECRET;

export function auth0Configured(): boolean {
  return Boolean(auth0Issuer && auth0ClientId && auth0ClientSecret);
}

export function personalAccessTokenConfigured(): boolean {
  return (
    projectId !== undefined && tokenId !== undefined && privateKey !== undefined
  );
}

export const apiGatewayUrl = process.env.API_GATEWAY_URL!;
