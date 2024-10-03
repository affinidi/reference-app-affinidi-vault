# Event Management

This is a event reference app to demonstrate Zero party data exchange, interoperability of data across business boundaries and consent based data management for applications using Affinidi Login, Affinidi Iota framework, Credential Issuance and Affinidi Vault

## Getting started

1. Install the dependencies:
   ```
   npm install
   ```
2. Create a `.env` file:

   ```
   cp .env.example .env
   ```

3. Click here to [Set up your environment variables for Affinidi Login configuration](#set-up-your-affinidi-login-configuration)

4. Click here to [Set up your environment variables for Affinidi Iota configuration](#set-up-your-affinidi-iota-configuration)

5. Click here to [Set up your Personnel Access Token to interact with Affinidi services](#setup-personal-access-token)

6. [Set up Credential Issuance](#setup-credential-issuance)

7. Launch the app:

   ```
   npm run dev
   ```

   App will be available locally on [http://localhost:3000](http://localhost:3000).

## Set up your Affinidi Login configuration

1. Follow [this guide](./docs/setup-login-config.md) to set up your login configuration with callback URL as `http://localhost:3000/api/auth/callback/affinidi`

2. Copy your **Client ID**, **Client Secret** and **Issuer** from your login configuration and paste them into your `.env` file:

```ini
PROVIDER_CLIENT_ID="<CLIENT_ID>"
PROVIDER_CLIENT_SECRET="<CLIENT_SECRET>"
PROVIDER_ISSUER="<ISSUER>"
```

## Set up your Affinidi Iota configuration

1. Follow [this guide](./docs/setup-iota-config.md) to set up your iota configuration for queries

2. Copy your **Configuration ID** and **Query ID** for relevant iota queries and paste them into your `.env` file:

```ini
NEXT_PUBLIC_IOTA_CONFIG_ID=""
NEXT_PUBLIC_IOTA_ADDRESS_QUERY=""
NEXT_PUBLIC_IOTA_MUSIC_RECOMMEND_QUERY=""
NEXT_PUBLIC_IOTA_EVENT_TICKET_QUERY=""
```

## Setup Personal Access Token

Follow [this guide](./docs/create-pat.md) to set up your Personnel Access Token

## Setup Credential Issuance

Create Issuance Configuration through Affinidi Portal with following details

1. Name for the configuration
2. Description
3. Issuing Wallet : You may select the same wallet created during iota configurations
4. Lifetime of Credential Offer
5. Supported Schema: Create following entry for supported Schema

```init
CredentialTypeId : EventTicketVC
JSON Schema URL : https://schema.affinidi.io/TEventTicketVCV1R0.json
JSON-LD Context URL : https://schema.affinidi.io/TEventTicketVCV1R0.jsonld
```

# Additional Information

### use React Custom Hook to query data using Iota

Custom hook `useIotaQuery`, accepts Iota configuration id and returns the query response

Sample Snippet

```
  const {
    isInitializing,
    statusMessage,
    handleInitiate,
    isRequestPrepared,
    isWaitingForResponse,
    errorMessage,
    dataRequest,
    data: iotaRequestData,
  } = useIotaQuery({
    configurationId,
  });
  useEffect(() => {
    if (!iotaRequestData) return;

    //data for email query
    const addressData = iotaRequestData[emailQueryId]
    if (addressData) {
      console.log('Your email', emailData.email)
    }

  }, [iotaRequestData]);

  ...
  ...

  return (
   <>
      {isInitializing && (
        <div>
            <p>{statusMessage || "Loading"}...</p>
       </div>
      )}

      <button onClick={() => handleInitiate(emailQueryId)} >
        Request Email
      </button>

      {iotaRequestData && iotaRequestData[emailQueryId] && (
        <pre>
            {JSON.stringify(emailData, null, 1)}
         </pre>
      )}

   </>
  )

```

- **isInitializing** : This is Boolean type, return true when user starts the request and false when completes the response
- **statusMessage** : This is string type, which gives message on the status of each event like creating Iota session, preparing request etc...
- **handleInitiate** : This is method, which can be called on click of a button to trigger the request
- **isRequestPrepared** : This is Boolean type, which returns true when prepare request is started
- **isWaitingForResponse** : This is Boolean type, which returns true when we prepared the request and waiting for the response, will be false when we got the response
- **dataRequest** : This is object type, contains request and response of the Iota request
- **data** : This is object type, which contains the credentialSubject group by each query Id of all the VCs e.g. `data[emailQueryId]`
