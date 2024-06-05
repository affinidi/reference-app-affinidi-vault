import { projectId, apiGatewayUrl, tokenEndpoint, keyId, tokenId, passphrase, privateKey, publicKey } from 'src/lib/secrets'
import { AuthProvider } from '@affinidi-tdk/auth-provider'
import {
  IssuanceApi,
  Configuration as IssuanceConfiguration,
  StartIssuanceInput,
} from '@affinidi-tdk/credential-issuance-client'
import { DefaultApi, Configuration as VerificationConfiguration, VerifyPresentationInput } from '@affinidi-tdk/credential-verification-client'

const stats = {
  "apiGatewayUrl": apiGatewayUrl,
  "tokenEndpoint": tokenEndpoint,
  "keyId": keyId,
  "tokenId": tokenId,
  "passphrase": passphrase,
  "privateKey": privateKey,
  "publicKey": publicKey,
  "projectId": projectId
}
const authProvider = new AuthProvider(stats);

export const CredentialsClient = {

  IssuanceStart: async (apiData: StartIssuanceInput) => {
    const api = new IssuanceApi(
      new IssuanceConfiguration({
        apiKey: authProvider.fetchProjectScopedToken.bind(authProvider),
        basePath: `${apiGatewayUrl}/cis`,
      }),
    )

    const { data } = await api.startIssuance(projectId, apiData);
    console.log('startIssuance response', data)
    return data
  },

  verifyPresentation: async (apiData: VerifyPresentationInput) => {
    const api = new DefaultApi(
      new VerificationConfiguration({
        apiKey: authProvider.fetchProjectScopedToken.bind(authProvider),
        basePath: `${apiGatewayUrl}/ver`,
      }),
    )

    const { data } = await api.verifyPresentation(apiData);
    console.log('verifyPresentation response', data)
    return data
  }
}
