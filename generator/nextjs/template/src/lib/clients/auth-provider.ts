import { AuthProvider } from "@affinidi-tdk/auth-provider";
import { passphrase, privateKey, projectId, tokenId } from "src/lib/env";

const instance = global as unknown as { provider: AuthProvider };

export const getAuthProvider = () => {
  if (instance.provider) {
    return instance.provider;
  }
  instance.provider = new AuthProvider({
    projectId,
    tokenId,
    privateKey,
    ...(passphrase && { passphrase }),
  });
  return instance.provider;
};
