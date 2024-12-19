import {
  ChangeCredentialStatusInput,
  Configuration,
  ConfigurationApi,
  DefaultApi,
  IssuanceApi,
  StartIssuanceInput,
} from "@affinidi-tdk/credential-issuance-client";
import { apiGatewayUrl, projectId } from "../env";
import { getAuthProvider } from "./auth-provider";

export async function startIssuance(apiData: StartIssuanceInput) {
  const authProvider = getAuthProvider();
  const api = new IssuanceApi(
    new Configuration({
      apiKey: authProvider.fetchProjectScopedToken.bind(authProvider),
      basePath: `${apiGatewayUrl}/cis`,
    })
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
    })
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
    })
  );
  const { data } = await api.getIssuanceConfigById(configurationId);
  return data;
}

export async function changeCredentialStatus(
  configurationId: string,
  changeCredentialInput: ChangeCredentialStatusInput
) {
  const authProvider = getAuthProvider();
  const api = new DefaultApi(
    new Configuration({
      apiKey: authProvider.fetchProjectScopedToken.bind(authProvider),
      basePath: `${apiGatewayUrl}/cis`,
    })
  );
  const { data } = await api.changeCredentialStatus(
    projectId,
    configurationId,
    changeCredentialInput
  );
  return data;
}

export async function listIssuanceDataRecords(
  configurationId: string,
  exclusiveStartKey?: string
) {
  const authProvider = getAuthProvider();
  const api = new DefaultApi(
    new Configuration({
      apiKey: authProvider.fetchProjectScopedToken.bind(authProvider),
      basePath: `${apiGatewayUrl}/cis`,
    })
  );
  let res;
  if (exclusiveStartKey != "undefined") {
    res = await api.listIssuanceDataRecords(
      projectId,
      configurationId,
      10,
      exclusiveStartKey
    );
  } else {
    res = await api.listIssuanceDataRecords(projectId, configurationId, 10);
  }
  return res.data;
}
