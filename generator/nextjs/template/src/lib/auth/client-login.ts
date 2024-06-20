import { signIn } from "next-auth/react";

export async function clientLogin() {
  await signIn("affinidi");
}
