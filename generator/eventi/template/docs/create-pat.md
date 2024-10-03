# Setup Personal Access Token (PAT)

To create a personal Access Token,use Affinidi CLI 

## Install Affinidi CLI

Follow the guide below if you haven’t installed yet

1. Install Affinidi CLI using NPM

`npm install -g @affinidi/cli`

2. Verify that the installation is successful

`affinidi --version`

> Note that Affinidi CLI requires Node version 18 and above.

### Create Personal Access Token (PAT)

1. Log in to Affinidi CLI by running

  ```sh
  affinidi start
  ```

2. Once logged in successfully, create token by running below command

    ```sh
    affinidi token create-token -n MyAppVerificationKey -w -p my-secret-passphrase
    ```

`MyAppVerificationKey` : Replace with your own Name of the Personal Access Token, at least 8 chars long

`my-secret-passphrase` : Replace with your own Passphrase for generation of private public key pair

Sample response:

```json

{
  "apiGatewayUrl": "https://apse1.api.affinidi.io",
  "tokenEndpoint": "https://apse1.auth.developer.affinidi.io/auth/oauth2/token",
  "keyId": "XXXXXXXXXXXXXXXX",
  "tokenId": "XXXXXXXXXXXXXXXX",
  "passphrase": "XXXXXXXXXXXXXXXX",
  "privateKey": "XXXXXXXXXXXXXXXX",
  "publicKey": "XXXXXXXXXXXXXXXX",
  "projectId": "XXXXXXXXXXXXXXXX"
}
```

For more details on the command run below command
```sh
affinidi token create-token --help
```

3. Update `.env` file for the below variables with values obtained in above response

   ```
   API_GATEWAY_URL="YOUR_API_GATEWAY_URL"
   TOKEN_ENDPOINT="YOUR_TOKEN_ENDPOINT"
    PROJECT_ID="YOUR_PROJECT_ID"
    KEY_ID="YOUR_KEY_ID"
    TOKEN_ID="YOUR_TOKEN_ID"
    PASSPHRASE="YOUR_SECRET_PASSPHRASE"
    PRIVATE_KEY="YOUR_PAT_PRIVATE_KEY"
    PUBLIC_KEY="YOUR_PAT_PRIVATE_KEY"
   ```

Learn more command from our [Documentation](https://docs.affinidi.com/dev-tools/affinidi-cli/manage-token)