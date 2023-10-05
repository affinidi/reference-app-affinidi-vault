import { signIn } from "next-auth/react";
import { hostUrl } from "src/lib/variables";

export async function clientLogin() {
  await signIn("affinidi", { callbackUrl: hostUrl });
}
