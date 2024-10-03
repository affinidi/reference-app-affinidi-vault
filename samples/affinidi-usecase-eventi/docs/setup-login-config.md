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

`affinidi login create-config --name='Login Config Name' --redirect-uris='http://localhost:3000/api/auth/callback/affinidi'`

`--name` is what you want you login configuration to be called

`--redirect-uris` will be the URL where the user will be redirected after successful authorization.

> **Important**
>
> Once you receive the response, keep the `Client ID` and `Client Secret` safe which will be used later for setting up your IdP. Client Secret will only be available once.

3. (Optional) Update login configuration

For the current demo, you may use the following Presentation Definition & Token Mapping

**Presentation Definition**
```json
{
  "id": "profile_data",
  "submission_requirements": [
    {
      "rule": "pick",
      "min": 1,
      "from": "A"
    }
  ],
  "input_descriptors": [
    {
      "id": "profile_vc",
      "name": "Profile VC",
      "purpose": "Get some profile data",
      "group": [
        "A"
      ],
      "constraints": {
        "fields": [
          {
            "path": [
              "$.@context"
            ],
            "purpose": "Verify VC Context",
            "filter": {
              "type": "array",
              "contains": {
                "type": "string",
                "pattern": "^https://schema.affinidi.io/profile-template/context.jsonld$"
              }
            }
          },
          {
            "path": [
              "$.type"
            ],
            "purpose": "Verify VC Type",
            "filter": {
              "type": "array",
              "contains": {
                "type": "string",
                "pattern": "^ProfileTemplate$"
              }
            }
          },
          {
            "path": [
              "$.credentialSubject.person.email"
            ],
            "purpose": "Require email"
          },
          {
            "path": [
              "$.credentialSubject.person.givenName"
            ],
            "purpose": "Require first name"
          },
          {
            "path": [
              "$.credentialSubject.person.familyName"
            ],
            "purpose": "Require last name"
          },
          {
            "path": [
              "$.credentialSubject.person.birthdate"
            ],
            "purpose": "Require birth date"
          }
        ]
      }
    }
  ]
}

```

**ID Token Mapping**
```json
[
  {
    "sourceField": "$.credentialSubject.person.email",
    "idTokenClaim": "$.custom[0].email",
    "inputDescriptorId": "profile_vc"
  },
  {
    "sourceField": "$.credentialSubject.person.givenName",
    "idTokenClaim": "$.custom[1].givenName",
    "inputDescriptorId": "profile_vc"
  },
  {
    "sourceField": "$.credentialSubject.person.familyName",
    "idTokenClaim": "$.custom[2].familyName",
    "inputDescriptorId": "profile_vc"
  },
  {
    "sourceField": "$.credentialSubject.person.birthdate",
    "idTokenClaim": "$.custom[3].birthdate",
    "inputDescriptorId": "profile_vc"
  }
]

```


After saving file run command:

`affinidi login update-config --id=<LOGIN_CONFIG_ID> --file="<./<name_of_your_file>.json"`

> `--id` identifier of you login configuration
>
> `--file` JSON file path containing you login configuration data
