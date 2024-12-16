# Setup Iota Configuration

A framework that provides a secured and simplified data-sharing process from Affinidi Vault with user consent for enhanced user experience.
The Affinidi Iota Framework leverages the OID4VP (OpenID for Verifiable Presentation) standard to request and receive data from Affinidi Vault. The OID4VP is built with the OAuth 2.0 authorisation framework, providing developers with a simple and secure presentation of credentials.

## Create Iota configuration

When integrating with the Affinidi Iota Framework, developers must create a Configuration first, where they configure the Wallet used for signing the Request Token, the Request Token expiration to enhance security, and Presentation Definitions to query the data from the Affinidi Vault that users will consent to share.

1. Go to [Affinidi Portal](https://portal.affinidi.com/login) and click on the Affinidi Iota Framework page.

2. Click on Create Configuration and set the following fields:

- Wallet: Create a new wallet and provide the new wallet name, or select an existing Wallet that will sign and issue the credentials to the user.
- Vault JWT Expiration time: Credential Offers have a limited lifetime to enhance security. Consumers must claim the offer within this timeframe.

3. Optionally, you can configure whether to enable:

- Enable Verification: To verify the credentials the user shares using the Credential Verification service.
- Enable Consent Audit Log: To store the consent given by the user whenever they share data with the website.

4. After creating the configuration, define the Presentation Definitions to query specific data from the Affinidi Vault.

5. Create Presentations definitions for following queries

- Address VC
- Music Recommendation VC
- Event Ticket VC
- Identity Card VC

## PEX for the above Querys

1. Address VC

```Json
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
              "$.credentialSubject.person.addresses[0].streetAddress"
            ],
            "purpose": "Require streetAddress"
          },
          {
            "path": [
              "$.credentialSubject.person.addresses[0].addressRegion"
            ],
            "purpose": "Require address Region"
          },
          {
            "path": [
              "$.credentialSubject.person.addresses[0].addressLocality"
            ],
            "purpose": "Require address Locality"
          },
          {
            "path": [
              "$.credentialSubject.person.addresses[0].addressCountry"
            ],
            "purpose": "Require address Country"
          },
          {
            "path": [
              "$.credentialSubject.person.addresses[0].postalCode"
            ],
            "purpose": "Require postal Code"
          }
        ]
      }
    }
  ]
}
```

2. Music Recommendation VC

```Json
{
  "id": "music",
  "input_descriptors": [
    {
      "id": "category_vc",
      "name": "Category VC",
      "purpose": "Get some category data",
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
              "$.credentialSubject.categories.music.favoriteGenres[0].favoriteGenre"
            ]
          },
          {
            "path": [
              "$.credentialSubject.categories.behaviors.interests[0].interest"
            ]
          }
        ]
      }
    }
  ]
}
```

3. Event Ticket VC

```Json
{
  "id": "event_ticket",
  "input_descriptors": [
    {
      "id": "event_ticket",
      "name": "EventTicket VC",
      "purpose": "Check VC",
      "constraints": {
        "fields": [
          {
            "path": [
              "$.type"
            ],
            "purpose": "VC Type Check",
            "filter": {
              "type": "array",
              "contains": {
                "type": "string",
                "pattern": "^EventTicketVC$"
              }
            }
          }
        ]
      }
    }
  ]
}
```

4. Student Identity Card VC

```Json
{
  "id": "token_with_identitycard_vc",
  "input_descriptors": [
    {
      "id": "AlumniIdentityCardR1",
      "name": "AlumniIdentityCard VC",
      "purpose": "Check if Vault contains the required VC.",
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
                "pattern": "AlumniIdentityCard"
              }
            }
          }
        ]
      }
    }
  ]
}
```
