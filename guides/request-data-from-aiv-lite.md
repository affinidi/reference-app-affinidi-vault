# Request data from AIV Lite

You can request data from AIV Lite by using the [OID4VP flow](https://openid.net/specs/openid-4-verifiable-presentations-1_0.html).

## Prerequisites

- Install `@affinidi/client-aiv-extension` library from [NPM](https://www.npmjs.com/package/@affinidi/client-aiv-extension)

## Requesting email address

In order to request a Verifiable Credential of user's email address, call this method:
```js
import { AivExtensionClient } from '@affinidi/client-aiv-extension'

const client = new AivExtensionClient()

const presentationDefinition = {
  id: 'vp_token_with_email_vc',
  input_descriptors: [
    {
      id: 'email_vc',
      name: 'Email VC type',
      purpose: 'Check if VC type is correct',
      constraints: {
        fields: [
          {
            path: ['$.type'],
            filter: {
              type: 'array',
              pattern: 'Email',
            },
          },
        ],
      },
    },
    {
      id: 'email_vc_data',
      name: 'Email VC data',
      purpose: 'Check if data contains necessary fields',
      constraints: {
        fields: [
          {
            path: ['$.credentialSubject.email'],
            purpose: 'Email address',
            filter: {
              type: 'string'
            },
          },
        ],
      },
    },
  ],
}

client.initiateAuth({
  presentationDefinition,
  responseDestination: {
    responseMode: 'query',
    redirectUri: 'http://localhost:3000/callback',
  },
  nonce: nanoid(),
  state: nanoid(),
})
```

This will redirect user to the extension, where they confirm or deny the request.

Once accepted or declined, user will be redirected to the `redirectUri` with these query parameters:
- `error` and `error_description` if request is declined or failed,
- `vp_token`, `state` and `presentation_submission` if request succeeds.

You can use client library to parse the URL and validate the params:
```js
const { vpToken, state, presentationSubmission } = client.completeAuth(window.location.href)

console.log(vpToken.verifiableCredential[0].credentialSubject.email) // email@example.com
```

## Requesting data from connectors

The flow for requesting data from user's connectors is the same, the only difference is presentation definition contents.

For example, requesting Strava exercise details:
```js
const presentationDefinition = {
  id: 'vp_token_with_strava_vc',
  input_descriptors: [
    {
      id: 'strava_vc',
      name: 'Strava VC type',
      purpose: 'Check if VC type is correct',
      constraints: {
        fields: [
          {
            path: ['$.type'],
            filter: {
              type: 'array',
              pattern: 'StravaExerciseDetails',
            },
          },
        ],
      },
    },
    {
      id: 'strava_vc_data',
      name: 'Strava VC data',
      purpose: 'Check if data contains necessary fields',
      constraints: {
        fields: [
          {
            path: ['$.credentialSubject.data.avgExerciseMinutesPerWeek'],
            purpose: 'Average exercise minutes per week',
            filter: {
              type: 'number',
              minimum: 0,
            },
          },
        ],
      },
    },
  ],
}
```

## Verify the VP token

To verify VP token's authenticity, you can use Affinidi Verifier API. For example:

```js
const { data: { isValid } } = await axios({
  url: 'https://apse1.api.affinidi.io/ver/v1/verifier/verify-vp`,
  method: 'POST',
  headers: {
    Authorization: projectScopeToken,
  },
  data: {
    presentationDefinition, // the one that you used in initiateAuth() method
    presentationSubmission, // returned by completeAuth()
    verifiablePresentation: vpToken,
  }
})

console.log(isValid) // true
```

This reference app is already using the Affinidi Verifier API in `/api/verifier/verify-vp` endpoint. This endpoint needs `projectScopeToken`. For the backend to be able to obtain `projectScopeToken` you need to setup your application so that backend can act as a verifier. For this you need to:

1. Create machine user - this party will be a verifier
2. Create new project
3. Add machine user to this project
4. Provide permissions for machine user to be able to call `ver:verifyPresentation` action on the project

In order to complete actions mentioned above follow these steps:

1. Run these commands from project root. It generates key pair for machine user:

    ```sh
    npm run generate-keys PASSPHRASE KEYID
    ```

    Please specify your own `PASSPHRASE` and `KEYID` as you decide.

2. After running the command, a `keys` folder will be created. Copy the private key from `.private.key` file and paste it to the `PRIVATE_KEY` variable in the `.env` file.

3. Fill the `PASSPHRASE` and `KEY_ID` variables in `.env` file to the ones you specified when you created the private key.

4. For the next steps you'll need `userAccessToken`. Run `affinidi login` from cli (it's supposed you have `@affinidi/cli` installed globally), pass the login process. Find `userAccessToken` by using the command `cat ~/.affinidi/oAuthCred.json`, token is located at `$.userToken.access_token`.

5. Now, create the machine user by making the following API call. Copy the jwks from `keys/jwks.txt` file. Get the ID (`$.id`) that returns from the request and paste it to `MACHINE_USER_ID` in `.env` file.

    ```sh
    curl --location 'https://apse1.api.affinidi.io/iam/v1/machine-users' \
    --header 'Content-Type: application/json' \
    --header 'Authorization: Bearer {userAccessToken}' \
    --data '{
        "name": "Name for your machine user",
        "authenticationMethod": {
            "type": "PRIVATE_KEY",
            "signingAlgorithm": "RS256",
            "publicKeyInfo": {
                "jwks": {} // copy and paste the jwks from `jwks.txt` file
            }
        }}'
    ```

6. Create a project. Get the id that returns from the request and paste it to `PROJECT_ID` in the `.env` file:

    ```sh
    curl --location 'https://apse1.api.affinidi.io/iam/v1/projects' \
    --header 'Content-Type: application/json' \
    --header 'Accept: application/json' \
    --header 'Authorization: Bearer {userAccessToken}' \
    --data '{
        "name": "Name for your project"
    }'
    ```

7. Add machine user to the project:

    ```sh
    curl --location 'https://apse1.api.affinidi.io/iam/v1/projects/users' \
    --header 'Content-Type: application/json' \
    --header 'Accept: application/json' \
    --header 'Authorization: Bearer {projectScopedToken}' \
    --data '{
      "principalId": "user/{machineUserID}"
    }'
    ```

8. Give machine user permission to call `verifyPresentation` action by creating a policy:

    ```sh
    curl --location --request PUT 'https://apse1.api.affinidi.io/iam/v1/policies/users/{machineUserID}' \
    --header 'Content-Type: application/json' \
    --header 'Accept: application/json' \
    --header 'Authorization: Bearer {projectScopedToken}' \
    --data '{
      "version": "2022-12-15",
      "statement": [
        {
          "principal": [
            "ari:iam::{projectId}:user/{machineUserID}"
          ],
          "action": [
            "ver:verifyPresentation"
          ],
          "resource": [
            "*"
          ],
          "effect": "Allow"
        }
      ]
    }'
    ```
