import {
  Configuration,
  ConfigurationApi,
  IssuanceApi,
  StartIssuanceInput,
} from "@affinidi-tdk/credential-issuance-client";
import { apiGatewayUrl, projectId } from "src/lib/env";
import { getAuthProvider } from "./auth-provider";

export async function startIssuance(apiData: StartIssuanceInput) {
  const authProvider = getAuthProvider();
  const api = new IssuanceApi(
    new Configuration({
      apiKey: authProvider.fetchProjectScopedToken.bind(authProvider),
      basePath: `${apiGatewayUrl}/cis`,
    }),
  );
  const { data } = await api.startIssuance(projectId, apiData);
  return data;
}

export async function listIssuanceConfigurations() {
  const authProvider = getAuthProvider();
  const api = new ConfigurationApi(
    new Configuration({
      apiKey: authProvider.fetchProjectScopedToken.bind(authProvider),
      basePath: `${apiGatewayUrl}/cis`,
    }),
  );
  const { data } = await api.getIssuanceConfigList();
  return data.configurations;
}

export async function getIssuanceConfigurationById(configurationId: string) {
  const authProvider = getAuthProvider();
  const api = new ConfigurationApi(
    new Configuration({
      apiKey: authProvider.fetchProjectScopedToken.bind(authProvider),
      basePath: `${apiGatewayUrl}/cis`,
    }),
  );
  const { data } = await api.getIssuanceConfigById(configurationId);
  return data;
}
