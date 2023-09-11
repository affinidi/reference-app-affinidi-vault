# Setup Affinidi SSO

Affinidi SSO is a social provider that allows users to log into your website using AIV Lite.

## Prerequisites

- ID provider (Auth0, Ory, Okta, etc.)

## Create login configuration

In order to use Affinidi SSO, you first need to create login configuration for your application. You can achieve this using our CLI or via API.

### CLI

- [Set up CLI](https://beta.developer.affinidi.com/eap/getting-started/#step-2-configuring-the-affinidi-developer-tools)
- [Create login configuration](https://beta.developer.affinidi.com/eap/how-to-guides/lwa-guides/login-config-cli/)

### API

![Create login configuration](./images/create-login-configuration.png)  

Example of VP Definition: 
```json
{
  "name": "Reference App Client",
  "redirectUris": [
    "https://{domain}/login/callback"
  ],
  "vpDefinition": "{\"id\":\"vp_combined_email_user_profile_combined\",\"submission_requirements\":[{\"rule\":\"pick\",\"min\":1,\"from\":\"A\"}],\"input_descriptors\":[{\"id\":\"email_vc\",\"name\":\"Email VC\",\"purpose\":\"Check if VC type is correct\",\"group\":[\"A\"],\"constraints\":{\"fields\":[{\"path\":[\"$.credentialSchema.id\"],\"filter\":{\"type\":\"string\",\"pattern\":\"^https://schema.affinidi.com/EmailV1-0.json$\"}}]}},{\"id\":\"profile_vc\",\"name\":\"profile VC type\",\"purpose\":\"Check if VC type is correct\",\"group\":[\"A\"],\"constraints\":{\"fields\":[{\"path\":[\"$.credentialSchema.id\"],\"filter\":{\"type\":\"string\",\"pattern\":\"^https://schema.affinidi.com/UserProfileV2-0.json$\"}}]}},{\"id\":\"address\",\"name\":\"Address\",\"purpose\":\"To get address for ID Mapping\",\"constraints\":{\"fields\":[{\"path\":[\"$.credentialSubject.address\"]}]}},{\"id\":\"email\",\"name\":\"Email\",\"purpose\":\"To get email for ID Mapping\",\"constraints\":{\"fields\":[{\"path\":[\"$.credentialSubject.email\"]}]}},{\"id\":\"type\",\"name\":\"Type\",\"purpose\":\"To get type for ID Mapping\",\"constraints\":{\"fields\":[{\"path\":[\"$.type\"]}]}}]}",
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

> Use redirect URI provider by your IdP.  
> 
> For example, in Auth0 it's `https://{domain}/login/callback`.

Copy `clientId` and `clientSecret` fields from the response.

[Guide with more details](https://beta.developer.affinidi.com/eap/how-to-guides/lwa-guides/login-config-api/)

## Create a social connector

Go to your ID provider and create a custom social connector.

For example, in Auth0 you can create a custom connector in **Authentication -> Social** section:
![Create a social connector](./images/create-social-connector.png)  

Paste `clientId`, `clientSecret` from the previous step and use these parameters:
- Authorization URL: `https://euw1.vpa.auth.affinidi.io/oauth2/auth`
- Token URL: `https://euw1.vpa.auth.affinidi.io/oauth2/token`
- Scope: `openid`

## IdP-specific guides

Check out our guides for [Auth0](./auth0/setup-auth0.md).
