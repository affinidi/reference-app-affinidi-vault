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
        userDID = profileItems.find((item: any) => typeof item.did === "string")?.did;
        user.email = profileItems.find((item: { email: string; }) => typeof item.email === "string")?.email;
        user.familyName = profileItems.find((item: { familyName: string; }) => typeof item.familyName === "string")?.familyName;
        user.givenName = profileItems.find((item: { givenName: string; }) => typeof item.givenName === "string")?.givenName;
        // user.picture = profileItems.find((item: { picture: string; }) => typeof item.picture === "string")?.picture;
        user.country = profileItems.find((item: { country: string; }) => typeof item.country === "string")?.country;
        // user.phoneNumber = profileItems.find((item: { phoneNumber: string; }) => typeof item.phoneNumber === "string")?.phoneNumber;
        user.gender = profileItems.find((item: { gender: string; }) => typeof item.gender === "string")?.gender;
        user.birthdate = profileItems.find((item: { birthdate: string; }) => typeof item.birthdate === "string")?.birthdate;
        user.postalCode = profileItems.find((item: { postalCode: string; }) => typeof item.postalCode === "string")?.postalCode;
        user.city = profileItems.find((item: { locality: string; }) => typeof item.locality === "string")?.locality;
        user.address = profileItems.find((item: { formatted: string; }) => typeof item.formatted === "string")?.formatted;
        user.verified = profileItems.find((item: { livenessCheckPassed: boolean; }) => typeof item.livenessCheckPassed === "boolean")?.livenessCheckPassed;
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
