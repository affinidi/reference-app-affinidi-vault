import { NextAuthOptions } from "next-auth";
import { provider } from "src/lib/auth/auth-provider";

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
    // "account" is only passed the first time this callback is called on a new session, after the user signs in
    // this defines how JWT is generated and is then used in session() callback as "token"
    async jwt({ token, account, profile }) {
      const custom = (profile as any)?.["profile"];

      const email = custom?.find(
        (i: any) => typeof i.email === "string"
      )?.email;
      const address = custom?.find(
        (i: any) => typeof i.address === "object"
      )?.address;

      return {
        ...token,
        ...(email && {
          user: {
            email,
            ...(address && { ...address }),
          },
        }),
        ...(account?.access_token && { accessToken: account?.access_token }),
        ...(account?.id_token && { idToken: account?.id_token }),
        ...(profile?.sub && { userId: profile?.sub }),
      };
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
