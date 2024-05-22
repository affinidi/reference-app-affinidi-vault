# Overview

An express server using NodeJS which exposes two endpoints to complete OAuth using PKCE Flow.

# @affinidi/passport-affinidi

@affinidi/passport-affinidi is a powerful module for authenticating users with `Affinidi Login` using the OIDC Code Grant flow. This strategy seamlessly integrates `Affinidi Login` into your Node.js applications. By leveraging Passport, you can effortlessly incorporate Affinidi authentication into any application or framework that supports Connect-style middleware, including Express.

This provider simplifies the process by creating an Affinidi OpenID client and registering two essential routes:

1. **Initialization Route**: The first GET route (defaulted to `/api/affinidi-auth/init`) returns the Affinidi authorization URL, which allows frontend applications to redirect to Affinidi Login flow.
2. **Completion Route**: The second POST route (defaulted to `/api/affinidi-auth/complete`) processes the response (code and state) from Affinidi authorization server, performs the exchange for the ID Token, and returns the user's profile.

## Installation

```
npm install @affinidi/passport-affinidi
```

## Usage

Here's how to use `@affinidi/passport-affinidi` in your Node.js application:

1. Import the affinidi provider

```
import { affinidiProvider } from '@affinidi/passport-affinidi'
```

2. Initialize the provider by passing your express server instance and configuration options, including the Affinidi's issuer, client ID, secret, and redirect URIs.

```
 await affinidiProvider(app, {
        id: "affinidi",
        issuer: process.env.AFFINIDI_ISSUER,
        client_id: process.env.AFFINIDI_CLIENT_ID,
        pkce: true,
        redirect_uris: ['http://localhost:3000/auth/callback']
    });
```

## Run the App

1. Create Affinidi Login configuration with Authentication Mode as 'None', you can find same PEX & ID Token mapping [here](/profile-pex.json)

2. Update .env with the Login configuration settings

```
PROVIDER_CLIENT_ID="<CLIENT_ID>"
PROVIDER_ISSUER="<ISSUER>"
PROVIDER_REDIRECT_URL="http://localhost:3000/auth/callback"
```

5. Install the packages by executing the below command

```
npm install
```

4. Run the server

```
node index.js
```

API will be running on the [http://localhost:3001](http://localhost:3001)

## Sample API Calls using CURL

Here's how to initiate and complete the Affinidi from your frontend:

1. Initiate the Affinidi flow

```
curl --location 'http://localhost:3001/api/affinidi-auth/init'
```
Sample Response
```
{
    "authorizationUrl":"https://427cc658-ddf8-4e5e-93b3-c038c13fac19.apse1.login.affinidi.io/oauth2/auth?client_id=ee144991-adc3-4f31-96bc-7876cdec6ea3&scope=openid&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback&code_challenge=nclP4DJsfLwJft6KQ58A1gGaNy0g4kVWtli93t-F_Ho&code_challenge_method=S256&state=QaOxjjU-oxrIJvq6ca0BYxpVGK3YrfCN5nucnyrL7kE"
}
```

2. Complete the Affinidi flow from callback url and get user profile/error

```
curl --location 'http://localhost:3001/api/affinidi-auth/complete' \
--header 'Content-Type: application/json' \
--data '{
    "code": "ory_ac_LfchXpWu3VkPWYU1AcpaCjbxGm3z_U0e6SF1QxwJBno.hnapsQj9n8fuBp-poZw1i-qCBmFn2jRKdEXD-Fd0U0c",
    "state": "kb_2RYDCKUCPfohcpbshl_MaNwA8JYeSYY7QjqCYM0Y"
}'
```

Sample Response
```
{
    "user": {
        "acr": "0",
        "at_hash": "MCyADFGco9OEb3lqBMqJrg",
        "aud": [
            "ee144991-adc3-4f31-96bc-7876cdec6ea3"
        ],
        "auth_time": 1714400742,
        "custom": [
            {
                "email": "paramesh.k@affinidi.com"
            },
            {
                "issuer": "did:key:zQ3shtMGCU89kb2RMknNZcYGUcHW8P6Cq3CoQyvoDs7Qqh33N"
            },
            {
                "phoneNumber": "99123334445"
            },
            {
                "givenName": "Paramesh"
            },
            {
                "familyName": "Kamarthi"
            },
            {
                "nickname": "param"
            },
            {
                "middleName": "-"
            },
            {
                "birthdate": "1999-10-10"
            },
            {
                "gender": "male"
            },
            {
                "picture": "https://media.licdn.com/dms/image/C5103AQFwUMUmqZl1dw/profile-displayphoto-shrink_400_400/0/1517040412290?e=1716422400&v=beta&t=sZ-Of4mM7HZLiJIuHqTVarjJSRQqc0F1ZVdFeVJn_qc"
            },
            {
                "formatted": "Big Layout, Bellandur"
            },
            {
                "locality": "Bangalore"
            },
            {
                "postalCode": "560103"
            },
            {
                "country": "India"
            },
            {
                "livenessCheckPassed": true
            },
            {
                "did": "did:key:zQ3shqeuTqstXCVKL4peLhxmmLTjYSyoeCoPasx3vK3PQPf6i"
            }
        ],
        "exp": 1714401677,
        "iat": 1714400777,
        "iss": "https://427cc658-ddf8-4e5e-93b3-c038c13fac19.apse1.login.affinidi.io",
        "jti": "5637d929-0cb5-4e1c-8adb-3edac0da6898",
        "rat": 1714400714,
        "sid": "7c0ba92f-75a8-4e70-bace-3868f3f55a54",
        "sub": "did:key:zQ3shqeuTqstXCVKL4peLhxmmLTjYSyoeCoPasx3vK3PQPf6i"
    }
}
```