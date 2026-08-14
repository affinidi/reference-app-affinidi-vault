import { NextAuthOptions } from "next-auth";
import {
  PROVIDER_ATTRIBUTES_KEY,
  provider,
  providers,
  AUTH0_PROVIDER_ID,
} from "src/lib/auth/next-auth-provider";
import { UserInfo } from "src/types/types";

export const authOptions: NextAuthOptions = {
  // debug: true,
  session: { strategy: "jwt" },
  providers,
  // Custom sign-in/error page so OAuth failures (e.g. a rejected Auth0 login)
  // show branded, contextual messaging instead of the default NextAuth screen.
  // NextAuth v4 routes OAuth callback errors to the sign-in page, so both point
  // to the same route.
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  callbacks: {
    // checks whether user is allowed to sign in
    async signIn({ account }) {
      // Auth0 (generic OIDC) authenticates via id_token; used as authN for the
      // websocket flow when not using Affinidi Login. Account restrictions
      // (allowed domain, blocked users) are enforced in Auth0, and its error is
      // surfaced verbatim via middleware on the sign-in page.
      if (account?.provider === AUTH0_PROVIDER_ID) {
        return Boolean(account.id_token);
      }
      return Boolean(
        account?.provider === provider.id &&
          account.access_token &&
          account.id_token
      );
    },

    // "account" and "profile" are only passed the first time this callback is called on a new session, after the user signs in
    // this defines how JWT is generated and is then used in session() callback as "token"
    async jwt({ token, account, profile }) {
      // Remember which provider authenticated this session (e.g. Auth0 vs
      // Affinidi Login) so the UI can gate provider-specific flows.
      if (account?.provider) {
        token.provider = account.provider;
      }
      const profileItems = (profile as any)?.[PROVIDER_ATTRIBUTES_KEY];
      if (profile && profileItems) {
        let userDID: string;
        let user: UserInfo = {};
        userDID = profileItems.find(
          (item: any) => typeof item.did === "string"
        )?.did;
        user.email = profileItems.find(
          (item: any) => typeof item.email === "string"
        )?.email;
        user.country = profileItems.find(
          (item: any) => typeof item.address === "object"
        )?.address?.country;
        token = {
          ...token,
          user,
          ...(userDID && { userId: userDID }),
        };
      }

      // Here you also have access to account.access_token and account.id_token

      return token;
    },

    // session is persisted as an HttpOnly cookie
    async session({ session, token }) {
      return {
        ...session,
        ...(token.user && { user: { ...session.user, ...token.user } }),
        ...(token.userId && { userId: token.userId }),
        ...(token.provider && { provider: token.provider }),
      };
    },
  },
};
