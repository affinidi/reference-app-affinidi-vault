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


export const getAuthProvider = () => {
  return new AuthProvider({
    projectId: projectId,
    tokenId: tokenId,
    privateKey: privateKey,
    publicKey: publicKey,
    keyId: keyId,
    passphrase: passphrase,
    tokenEndpoint: tokenEndpoint, // TODO remove
    apiGatewayUrl: apiGatewayUrl, // TODO remove
  });
};
