import {
  Configuration,
  ConfigurationsApi,
  PexQueryApi,
} from "@affinidi-tdk/iota-client";
import { apiGatewayUrl } from "src/lib/secrets";
import { authProvider } from "./auth-provider";

export async function listIotaConfigurations() {
  const api = new ConfigurationsApi(
    new Configuration({
      apiKey: authProvider.fetchProjectScopedToken.bind(authProvider),
      basePath: `${apiGatewayUrl}/ais`,
    })
  );
  const { data } = await api.listIotaConfigurations();
  return data.configurations;
}

export async function listPexQueriesByConfigurationId(configurationId: string) {
  const api = new PexQueryApi(
    new Configuration({
      apiKey: authProvider.fetchProjectScopedToken.bind(authProvider),
      basePath: `${apiGatewayUrl}/ais`,
    })
  );
  const { data } = await api.listPexQueries(configurationId);
  return data.pexQueries;
}
