import {
  Configuration,
  ConfigurationsApi,
  PexQueryApi,
  IotaApi,
  CallbackApi,
  IotaConfigurationDtoModeEnum,
  InitiateDataSharingRequestOKData,
  FetchIOTAVPResponseOK,
} from "@affinidi-tdk/iota-client";
import { v4 as uuidv4 } from "uuid";
import * as jose from "jose";
import { getAuthProvider } from "./auth-provider";
import { apiGatewayUrl } from "../env";

export async function listIotaWebsocketConfigurations() {
  const authProvider = getAuthProvider();
  const api = new ConfigurationsApi(
    new Configuration({
      apiKey: authProvider.fetchProjectScopedToken.bind(authProvider),
      basePath: `${apiGatewayUrl}/ais`,
    })
  );
  const { data } = await api.listIotaConfigurations();
  return data.configurations.filter(
    (config) => config.mode === IotaConfigurationDtoModeEnum.Websocket
  );
}

export async function listIotaRedirectConfigurations() {
  const authProvider = getAuthProvider();
  const api = new ConfigurationsApi(
    new Configuration({
      apiKey: authProvider.fetchProjectScopedToken.bind(authProvider),
      basePath: `${apiGatewayUrl}/ais`,
    })
  );
  const { data } = await api.listIotaConfigurations();
  return data.configurations.filter(
    (config) => config.mode === IotaConfigurationDtoModeEnum.Redirect
  );
}

export async function listPexQueriesByConfigurationId(configurationId: string) {
  const authProvider = getAuthProvider();
  const api = new PexQueryApi(
    new Configuration({
      apiKey: authProvider.fetchProjectScopedToken.bind(authProvider),
      basePath: `${apiGatewayUrl}/ais`,
    })
  );
  const { data } = await api.listPexQueries(configurationId);
  return data.pexQueries;
}

export async function initiateDataSharingRequest(
  configurationId: string,
  queryId: string,
  redirectUri: string,
  nonce: string
) {
  const authProvider = getAuthProvider();
  const api = new IotaApi(
    new Configuration({
      apiKey: authProvider.fetchProjectScopedToken.bind(authProvider),
      basePath: `${apiGatewayUrl}/ais`,
    })
  );

  const { data: dataSharingRequestResponse } =
    await api.initiateDataSharingRequest({
      configurationId,
      mode: IotaConfigurationDtoModeEnum.Redirect,
      queryId,
      correlationId: uuidv4(),
      nonce,
      redirectUri,
    });

  const { correlationId, transactionId, jwt } =
    dataSharingRequestResponse.data as InitiateDataSharingRequestOKData;
  return { correlationId, transactionId, jwt };
}

export async function fetchIotaVpResponse(
  configurationId: string,
  correlationId: string,
  transactionId: string,
  responseCode: string
) {
  const authProvider = getAuthProvider();
  const api = new IotaApi(
    new Configuration({
      apiKey: authProvider.fetchProjectScopedToken.bind(authProvider),
    })
  );

  const iotaVpResponse: FetchIOTAVPResponseOK = await api.fetchIotaVpResponse({
    configurationId,
    correlationId,
    transactionId,
    responseCode,
  });

  const vp = JSON.parse((iotaVpResponse.data as any).vpToken);
  return { vp: vp, nonce: iotaVpResponse.data.nonce };
}
