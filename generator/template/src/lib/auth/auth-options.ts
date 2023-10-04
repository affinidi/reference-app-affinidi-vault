import { NextAuthOptions } from "next-auth";
import { PROVIDER_ATTRIBUTES_KEY, provider } from "src/lib/auth/auth-provider";
import { UserInfo } from "src/types/types";

export const authOptions: NextAuthOptions = {
  debug: true,
  session: { strategy: "jwt" },
  providers: [provider],
  callbacks: {
    // checks whether user is allowed to sign in
    async signIn({ account }) {
      return Boolean(
        account?.provider === provider.id &&
          account.access_token &&
          account.id_token
      );
    },
    // "account" and "profile" are only passed the first time this callback is called on a new session, after the user signs in
    // this defines how JWT is generated and is then used in session() callback as "token"
    async jwt({ token, account, profile }) {
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

      if (account) {
        token = {
          ...token,
          ...(account?.access_token && { accessToken: account.access_token }),
          ...(account?.id_token && { idToken: account.id_token }),
        };
      }

      return token;
    },
    // session is persisted as an HttpOnly cookie
    async session({ session, token }) {
      return {
        ...session,
        ...(token.user && { user: { ...session.user, ...token.user } }),
        ...(token.accessToken && { accessToken: token.accessToken }),
        ...(token.idToken && { idToken: token.idToken }),
        ...(token.userId && { userId: token.userId }),
      };
    },
  },
};
