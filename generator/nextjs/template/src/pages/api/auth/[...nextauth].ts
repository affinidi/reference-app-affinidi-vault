import NextAuth from "next-auth";
import { authOptions } from "src/lib/auth/next-auth-options";

export default NextAuth(authOptions);
