import {
  Configuration,
  ConfigurationsApi,
  PexQueryApi,
  IotaApi,
  CallbackApi,
  InitiateDataSharingRequestOKData,
  FetchIOTAVPResponseOK,
} from '@affinidi-tdk/iota-client'
import { getAuthProvider } from './auth-provider'
import { randomUUID } from 'crypto'
import * as jose from 'jose'

export async function listIotaConfigurations() {
  const authProvider = getAuthProvider()
  const api = new ConfigurationsApi(
    new Configuration({
      apiKey: authProvider.fetchProjectScopedToken.bind(authProvider),
    }),
  )
  const { data } = await api.listIotaConfigurations()
  return data.configurations
}

export async function listPexQueriesByConfigurationId(configurationId: string) {
  const authProvider = getAuthProvider()
  const api = new PexQueryApi(
    new Configuration({
      apiKey: authProvider.fetchProjectScopedToken.bind(authProvider),
    }),
  )
  const { data } = await api.listPexQueries(configurationId)
  return data.pexQueries
}

// NOTE: this is all-in-one method to test the flow is working
export async function startIotaRedirectFlow() {
  // TODO: get data from user, FE
  const iotaConfigId =  process.env.IOTA_CONFIG_ID!
  const queryId =  process.env.QUERY_ID!
  const did =  process.env.DID!
  const redirectUri =  process.env.REDIRECT_URI!

  const authProvider = getAuthProvider()
  const { iotaJwt, iotaSessionId } = await authProvider.createIotaToken(iotaConfigId, did)
  // console.log({ iotaJwt })

  // NOTE: for tdk-client AFFINIDI_TDK_ENVIRONMEN=dev will NOT work, we have to pass the basePath for dev environment
  const iotaConfiguration = new Configuration({ accessToken: iotaJwt, basePath: `${process.env.API_GATEWAY_URL}/ais` })
  const callbackConfiguration = new Configuration({ basePath: `${process.env.API_GATEWAY_URL}/ais` })
  const iotaApi = new IotaApi(iotaConfiguration)
  const callbackApi = new CallbackApi(callbackConfiguration)

  let response

  try {
    const { data: dataSharingRequestResponse } = await iotaApi.initiateDataSharingRequest({
        queryId,
        correlationId: randomUUID(),
        tokenMaxAge: 5000,
        nonce: randomUUID().slice(0, 10),
        redirectUri,
      })

    const { correlationId, transactionId, jwt } = dataSharingRequestResponse.data as InitiateDataSharingRequestOKData
    const state = jose.decodeJwt(jwt).state! as string

    const presentation_submission = process.env.PRESENTATION_SUBMISSION!
    const vp_token = process.env.VP_TOKEN!

    // NOTE: this is a magic: since "vault" does not support redirect flow yet, the below call is what should be done "elsewhere"
    const callbackResponse: any = await callbackApi.iotOIDC4VPCallback({ state, presentation_submission, vp_token })
    // NOTE: once user is redirected from the vault to FE, we should have a `responseCode`, used for the 2nd and last call
    //       that completes Iota redirect flow

    const iotaVpResponse: FetchIOTAVPResponseOK = await iotaApi.fetchIotaVpResponse({
      correlationId,
      transactionId,
      responseCode: callbackResponse?.data?.redirectResponse?.responseCode,
    })

    const vp = JSON.parse((iotaVpResponse.data as any).vpToken)

    response = vp.verifiableCredential[0].credentialSubject.email
    console.log('>>> Iota redirect flow is completed. Your data is: ', response)

    return response
  } catch (error: any) {
    console.error(error.config.headers, error.response.data)
  }
}