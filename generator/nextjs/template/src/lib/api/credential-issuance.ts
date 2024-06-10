import {
  Configuration,
  ConfigurationApi,
  IssuanceApi,
  StartIssuanceInput,
} from "@affinidi-tdk/credential-issuance-client";
import { apiGatewayUrl, projectId } from "src/lib/secrets";
import { authProvider } from "./auth-provider";

export async function startIssuance(apiData: StartIssuanceInput) {
  const api = new IssuanceApi(
    new Configuration({
      apiKey: authProvider.fetchProjectScopedToken.bind(authProvider),
      basePath: `${apiGatewayUrl}/cis`,
    })
  );
  const { data } = await api.startIssuance(projectId, apiData);
  return data;
}

export async function getConfigurations() {
  const api = new ConfigurationApi(
    new Configuration({
      apiKey: authProvider.fetchProjectScopedToken.bind(authProvider),
      basePath: `${apiGatewayUrl}/cis`,
    })
  );
  const { data } = await api.getIssuanceConfigList();
  return data;
}

export async function getConfigurationById(configurationId: string) {
  const api = new ConfigurationApi(
    new Configuration({
      apiKey: authProvider.fetchProjectScopedToken.bind(authProvider),
      basePath: `${apiGatewayUrl}/cis`,
    })
  );
  const { data } = await api.getIssuanceConfigById(configurationId);
  return data;
}
