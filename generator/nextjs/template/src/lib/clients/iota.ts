import {
  Configuration,
  ConfigurationsApi,
  PexQueryApi,
} from "@affinidi-tdk/iota-client";
import { getAuthProvider } from "./auth-provider";

export async function listIotaConfigurations() {
  const authProvider = getAuthProvider();
  const api = new ConfigurationsApi(
    new Configuration({
      apiKey: authProvider.fetchProjectScopedToken.bind(authProvider),
    }),
  );
  const { data } = await api.listIotaConfigurations();
  return data.configurations;
}

export async function listPexQueriesByConfigurationId(configurationId: string) {
  const authProvider = getAuthProvider();
  const api = new PexQueryApi(
    new Configuration({
      apiKey: authProvider.fetchProjectScopedToken.bind(authProvider),
    }),
  );
  const { data } = await api.listPexQueries(configurationId);
  return data.pexQueries;
}
