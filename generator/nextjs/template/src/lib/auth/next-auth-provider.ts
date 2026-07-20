import { Provider } from "next-auth/providers";
import {
  providerClientId,
  providerClientSecret,
  providerIssuer,
  auth0ClientId,
  auth0ClientSecret,
  auth0Issuer,
  auth0Configured,
} from "src/lib/env";

export const PROVIDER_ATTRIBUTES_KEY = "custom";

export const AFFINIDI_PROVIDER_ID = "affinidi";
export const AUTH0_PROVIDER_ID = "auth0";

export const provider: Provider = {
  id: AFFINIDI_PROVIDER_ID,
  name: "Affinidi",
  clientId: providerClientId,
  clientSecret: providerClientSecret,
  type: "oauth",
  wellKnown: `${providerIssuer}/.well-known/openid-configuration`,
  authorization: {
    params: {
      prompt: "login",
      scope: "openid offline_access",
    },
  },
  client: {
    token_endpoint_auth_method: "client_secret_post",
  },
  idToken: true,
  profile(profile) {
    return {
      id: profile.sub,
      email: profile.custom?.find((i: any) => typeof i.email === "string")
        ?.email,
    };
  },
};

// Second, non-Affinidi login provider used as authN for the websocket flow when
// the holder is not using Affinidi Vault (e.g. the TDK Vault). Generic OIDC
// provider pointed at Auth0; enabled only when AUTH0_* env is configured so the
// app still runs with just Affinidi Login.
// TODO: swap the issuer/client for Keycloak or any OIDC IdP — no code change.
export const auth0Provider: Provider = {
  id: AUTH0_PROVIDER_ID,
  name: "Auth0",
  clientId: auth0ClientId,
  clientSecret: auth0ClientSecret,
  type: "oauth",
  wellKnown: `${auth0Issuer}/.well-known/openid-configuration`,
  authorization: {
    params: {
      scope: "openid profile email",
    },
  },
  idToken: true,
  profile(profile) {
    return {
      id: profile.sub,
      email: profile.email,
    };
  },
};

export const providers: Provider[] = [
  provider,
  ...(auth0Configured() ? [auth0Provider] : []),
];
