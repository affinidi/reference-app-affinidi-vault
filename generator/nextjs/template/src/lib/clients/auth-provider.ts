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
} from "src/lib/secrets";

export const authProvider = new AuthProvider({
  apiGatewayUrl: apiGatewayUrl, // TODO remove
  tokenEndpoint: tokenEndpoint, // TODO remove
  keyId: keyId,
  tokenId: tokenId,
  passphrase: passphrase,
  privateKey: privateKey,
  publicKey: publicKey,
  projectId: projectId,
});
