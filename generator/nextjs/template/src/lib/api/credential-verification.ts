import {
  Configuration,
  DefaultApi,
  VerifyPresentationInput,
} from "@affinidi-tdk/credential-verification-client";
import { apiGatewayUrl } from "../secrets";
import { authProvider } from "./auth-provider";

export async function verifyPresentation(apiData: VerifyPresentationInput) {
  const api = new DefaultApi(
    new Configuration({
      apiKey: authProvider.fetchProjectScopedToken.bind(authProvider),
      basePath: `${apiGatewayUrl}/ver`, // TODO remove
    })
  );

  const { data } = await api.verifyPresentation(apiData);
  console.log("verifyPresentation response", data);
  return data;
}
