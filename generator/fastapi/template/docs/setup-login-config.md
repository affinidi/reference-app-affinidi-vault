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
  - In fastapi it would be `http://127.0.0.1:8000/auth`

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
    "issuer": "https://<PROJECT-ID>.apse1.login.affinidi.io",
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
        "purpose": "Check if VC type is correct",
        "group": ["A"],
        "constraints": {
          "fields": [
            {
              "path": ["$.credentialSchema.id"],
              "filter": {
                "type": "string",
                "pattern": "^https://schema.affinidi.com/EmailV1-0.json$"
              }
            }
          ]
        }
      },
      {
        "id": "profile_vc",
        "name": "profile VC type",
        "purpose": "Check if VC type is correct",
        "group": ["A"],
        "constraints": {
          "fields": [
            {
              "path": ["$.credentialSchema.id"],
              "filter": {
                "type": "string",
                "pattern": "^https://schema.affinidi.com/UserProfileV2-0.json$"
              }
            }
          ]
        }
      },
      {
        "id": "address",
        "name": "Address",
        "purpose": "To get address for ID Mapping",
        "constraints": {
          "fields": [
            {
              "path": ["$.credentialSubject.address"]
            }
          ]
        }
      },
      {
        "id": "email",
        "name": "Email",
        "purpose": "To get email for ID Mapping",
        "constraints": {
          "fields": [
            {
              "path": ["$.credentialSubject.email"]
            }
          ]
        }
      },
      {
        "id": "type",
        "name": "Type",
        "purpose": "To get type for ID Mapping",
        "constraints": {
          "fields": [
            {
              "path": ["$.type"]
            }
          ]
        }
      }
    ]
  },
  "idTokenMapping": [
    {
      "sourceField": "$.type",
      "idTokenClaim": "type"
    },
    {
      "sourceField": "$.credentialSubject.email",
      "idTokenClaim": "email"
    },
    {
      "sourceField": "$.credentialSubject.address",
      "idTokenClaim": "address"
    }
  ]
}
```

After saving file run command:

`affinidi login update-config --id=<LOGIN_CONFIG_ID> --file="<./<name_of_your_file>.json"`

> `--id` identifier of you login configuration
>
> `--file` JSON file path containing you login configuration data
