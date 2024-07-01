import { AuthProvider } from "@affinidi-tdk/auth-provider";
import {
  keyId,
  passphrase,
  privateKey,
  projectId,
  publicKey,
  tokenId,
} from "src/lib/env";

export const getAuthProvider = () => {
  return new AuthProvider({
    projectId: projectId,
    tokenId: tokenId,
    privateKey: privateKey,
    publicKey: publicKey,
    keyId: keyId,
    passphrase: passphrase,
  });
};
