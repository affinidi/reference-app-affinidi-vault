import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from 'next-auth/jwt'

declare module "next-auth" {
  interface Session extends DefaultSession {
    did?: string
    userId: string
    email?: string
    accessToken: string
    idToken: string
  }
}


declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    did?: string
    userId: string
    email?: string
    accessToken: string
    idToken: string
  }
}
