import {
  AwsExchangeCredentialsOK,
  Configuration,
  ConfigurationsApi,
  IotaApi,
  PexQueryApi,
} from "@affinidi-tdk/iota-client";
import { getAuthProvider } from "./auth-provider";
import { apiGatewayUrl } from "../env";

export async function listIotaConfigurations() {
  const authProvider = getAuthProvider();
  const api = new ConfigurationsApi(
    new Configuration({
      apiKey: authProvider.fetchProjectScopedToken.bind(authProvider),
      basePath: `${apiGatewayUrl}/ais`,
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
      basePath: `${apiGatewayUrl}/ais`,
    }),
  );
  const { data } = await api.listPexQueries(configurationId);
  return data.pexQueries;
}

export async function getIdentityCredentials(
  sessionId: string,
  configurationId: string,
  did: string,
): Promise<AwsExchangeCredentialsOK> {
  const authProvider = getAuthProvider();
  const api = new IotaApi(
    new Configuration({
      apiKey: authProvider.fetchProjectScopedToken.bind(authProvider),
      basePath: `${apiGatewayUrl}/ais`,
    }),
  );
  const { data } = await api.awsExchangeCredentialsProjectToken({
    sessionId,
    configurationId,
    did,
  });
  return data;
}
