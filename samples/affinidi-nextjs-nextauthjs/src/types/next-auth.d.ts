import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

import { UserInfo } from "src/types/types";

declare module "next-auth" {
  interface Session extends DefaultSession {
    userId: string;
    user?: UserInfo;
    accessToken: string;
    idToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    userId: string;
    user?: UserInfo;
    accessToken: string;
    idToken: string;
  }
}
