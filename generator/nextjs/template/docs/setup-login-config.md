# Setup Login Configuration

## Create login configuration

To create a Login Configuration, you can either use Affinidi CLI or [Affinidi Portal](https://portal.affinidi.com/login)

### Install Affinidi CLI

Follow the guide below if you haven’t installed yet

1. Install Affinidi CLI using NPM

`npm install -g @affinidi/cli`

2. Verify that the installation is successful

`affinidi --version`

> Note that Affinidi CLI requires Node version 18 and above.

### Create login configuration

1. Log in to Affinidi CLI by running

`affinidi start`

2. Once logged in successfully, create Login Configuration by running

`affinidi login create-config --name='Login Config Name' --redirect-uris='https://example.com/authCallback'`

`--name` is what you want you login configuration to be called

`--redirect-uris` will be the URL where the user will be redirected after successful authorization.

- If you are using Affinidi directly without an identity provider, it should be a URL to your app
  - In NextAuth.js it would be `http://localhost:3000/api/auth/callback/affinidi`
- If you are using Auth0 as an identity provider it would be `https://{domain}/login/callback`

Sample response:

```json
{
  "ari": "ari:identity:ap-southeast-1:687b8872-a618-dt63-8978-e72ac32daeb1:login_configuration/c4f74d936cd31bde1c1fd3c1050bb76s",
  "projectId": "687b8872-a618-4e52-8978-e72ac32daec2",
  "id": "c4f74d936cd31bde1c1fd3c1050bb62d",
  "name": "Login Config Name",
  "auth": {
    "clientId": "<CLIENT_ID>",
    "clientSecret": "<CLIENT_SECRET>",
    "issuer": "https://apse1.api.affinidi.io/vpa/v1/login/project/<PROJECT-ID>",
    "tokenEndpointAuthMethod": "client_secret_post"
  },
  "redirectUris": ["https://example.com/authCallback"],
  "clientMetadata": {
    "name": "Login Config Name",
    "logo": "https://oidc-vp-adapter-frontend.affinidi.com/default-client-logo.png",
    "origin": "https://example.com"
  },
  "creationDate": "2023-08-11T06:26:37Z"
}
```

> **Important**
>
> Keep the `Client ID` and `Client Secret` safe that will be used later for setting up your IdP or your OIDC-compliant applications. Client Secret will only be available once.

3. (Optional) Update login configuration

By default Affinidi Login aks for an Email VC. To request user profile data update login configuration with instruction provided below.

To update first create JSON configuration file with such content:

```json
{
    "presentationDefinition": {
    "id": "vp_combined_email_user_profile_combined",
    "submission_requirements": [
      {
        "rule": "pick",
        "min": 1,
        "from": "A"
      }
    ],
    "input_descriptors": [
      {
        "id": "email_vc",
        "name": "Email VC",
        "purpose": "Check if data contains necessary fields",
        "group": ["A"],
        "constraints": {
          "fields": [
            {
              "path": [
                "$.type"
              ],
              "purpose": "Check if VC type is correct",
              "filter": {
                "type": "array",
                "contains": {
                  "type": "string",
                  "pattern": "Email"
                }
              }
            },
            {
              "path": [
                "$.credentialSubject.email"
              ],
              "purpose": "Check if VC contains email field",
              "filter": {
                "type": "string"
              }
            },
            {
              "path": [
                "$.issuer"
              ],
              "purpose": "Check if VC Issuer is Trusted",
              "filter": {
                "type": "string",
                "pattern": "^did:key:zQ3shtMGCU89kb2RMknNZcYGUcHW8P6Cq3CoQyvoDs7Qqh33N"
              }
            }
          ]
        }
      },
      {
        "id": "profile_vc",
        "name": "Country VC",
        "purpose": "Check if data contains necessary fields",
        "group": ["A"],
        "constraints": {
          "fields": [
            {
              "path": ["$.type"],
              "purpose": "Check if VC type is correct",
              "filter": {
                "type": "array",
                "pattern": "UserProfile"
              }
            },
            {
              "path": ["$.credentialSubject.address.country"],
              "purpose": "Check if VC contains address field",
              "filter": {
                "type": "string"
              }
            }
          ]
        }
      }
    ]
},
  "idTokenMapping": [
    {
      "sourceField": "$.credentialSubject.email",
      "idTokenClaim": "email"
    },
    {
      "sourceField": "$.credentialSubject.address.country",
      "idTokenClaim": "country"
    }
  ]
}

```

After saving file run command:

`affinidi login update-config --id=<LOGIN_CONFIG_ID> --file="<./<name_of_your_file>.json"`

> `--id` identifier of you login configuration
>
> `--file` JSON file path containing you login configuration data
