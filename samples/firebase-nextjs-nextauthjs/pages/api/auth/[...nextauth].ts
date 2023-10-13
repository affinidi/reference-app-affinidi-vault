import NextAuth, { NextAuthOptions } from "next-auth";
// TODO - Import Provider
import {
  authJwtSecret,
  providerClientId,
  providerClientSecret,
  providerIssuer,
} from "../../../utils/env";

// TODO: handle refresh token
export const authOptions: NextAuthOptions = {
  debug: true,
  session: { strategy: "jwt" },
  secret: authJwtSecret,
  providers: [
    {
      id: "Affinidi",
      name: "Affinidi",
      type: "oauth",
      wellKnown: `${providerIssuer}/.well-known/openid-configuration`,
      authorization: {
          params: { prompt: 'login', scope: "openid offline_access" }
      },
      idToken: true,
      clientId: providerClientId,
      clientSecret: providerClientSecret,
      client: {
          token_endpoint_auth_method: 'client_secret_post'
      },
      profile(profile, tokens) {
          const idToken = tokens.id_token && JSON.parse(Buffer.from(tokens.id_token.split('.')[1], 'base64').toString());
          return {
              id: profile.sub,
              user_id: profile.sub,
              app_metadata: { idToken },
          }
      },
    }
  ],

  callbacks: {
    // checks whether user is allowed to sign in
    async signIn({ account }) {
      return true;
    },

    async jwt({ token, account, profile }) {
      const custom = (profile as any)?.["custom"];
      const email = custom?.find(
      (i: any) => typeof i.email === "string"
      )?.email;
      const did = custom?.find((i: any) => typeof i.did === "string")?.did;

      return {
      ...token,
      ...(email && { email }),
      ...(did && { did: did.split(";")[0] }),
      ...(account?.access_token && { accessToken: account?.access_token }),
      ...(account?.id_token && { idToken: account?.id_token }),
      ...(profile?.sub && { userId: profile?.sub }),
      };
    },

    async session({ session, token }) {
      return {
      ...session,
      ...session.user,
      ...(token.did && { did: token.did.split(";")[0] }),
      ...(token.email && { email: token.email }),
      ...(token.userId && { userId: token.userId }),
      ...(token.accessToken && { accessToken: token.accessToken }),
      ...(token.idToken && { idToken: token.idToken }),
      };
    },

  } 
};

export default NextAuth(authOptions);
