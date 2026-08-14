import { signIn } from "next-auth/react";

export async function clientLogin() {
  await signIn("affinidi", { callbackUrl: "/" });
}

// authN for the websocket flow when not using Affinidi Vault (e.g. TDK Vault).
export async function clientLoginAuth0() {
  await signIn("auth0", { callbackUrl: "/" });
}
