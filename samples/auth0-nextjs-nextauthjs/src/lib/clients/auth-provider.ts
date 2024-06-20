import { AuthProvider } from "@affinidi-tdk/auth-provider";
import {
  apiGatewayUrl,
  keyId,
  passphrase,
  privateKey,
  projectId,
  publicKey,
  tokenEndpoint,
  tokenId,
} from "src/lib/env";

const instance = global as unknown as { provider: AuthProvider };

export const getAuthProvider = () => {
  if (instance.provider) {
    return instance.provider;
  }
  instance.provider = new AuthProvider({
    projectId: projectId,
    tokenId: tokenId,
    privateKey: privateKey,
    publicKey: publicKey,
    keyId: keyId,
    passphrase: passphrase,
    tokenEndpoint: tokenEndpoint, // TODO remove
    apiGatewayUrl: apiGatewayUrl, // TODO remove
  });
  return instance.provider;
};
