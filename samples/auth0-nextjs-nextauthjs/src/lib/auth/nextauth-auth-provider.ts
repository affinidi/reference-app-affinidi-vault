import Auth0Provider from "next-auth/providers/auth0";
import {
  providerClientId,
  providerClientSecret,
  providerIssuer,
  socialConnectorName,
} from "src/lib/env";

export const PROVIDER_ATTRIBUTES_KEY = "profile";

export const provider = Auth0Provider({
  clientId: providerClientId,
  clientSecret: providerClientSecret,
  issuer: providerIssuer,
  authorization: {
    params: {
      scope: "openid offline_access email profile",
      prompt: "login",
      ...(socialConnectorName && { connection: socialConnectorName }),
    },
  },
});
