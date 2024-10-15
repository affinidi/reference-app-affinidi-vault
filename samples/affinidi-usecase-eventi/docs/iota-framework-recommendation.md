## Module 4: (Optional) Building Consent-Driven Data Access for Recommendations

We will use the same `Eventi App` which we worked on in modules 1 & module 2 and enable the Affinidi Iota framework for **requesting music preferences and show the personalised experience** for events happening. It implements workflows that ensure users have full control over their data, emphasizing secure and transparent data-sharing practices using OID4VP & PEX.

More Details on Affinidi Iota Framework is available on [Affinidi Documentation](https://docs.affinidi.com/frameworks/iota-framework/)

## What you will build?

![Music Recommendations Sneak Peak](./images/iota-recoomendations.gif)

## Table of content

| Content                           | Description                                                                                                                                    |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `Pre-Requisite`                   | Complete the [pre-requisite](#pre-requisite) for Affinidi Iota Framework                                                                       |
| `Add Recommendations PEX`         | Update [Affinidi Iota Framework](#add-recommendations-pex-in-affinidi-iota-configuration) to request music preferences                         |
| `Update .env files`               | Update [.env](#update-environment-variables) files                                                                                             |
| `Use useIotaQuery Hook`           | Initiate Iota Request using [custom hook](#use-react-custom-hook-useiotaquery-to-request-event-ticket-vc)                                      |
| `Invoke Request on Event handler` | Invoke Iota initiation request inside the [handleInitiateRecommendations](#apply-action-on-button-click-handleinitiaterecommendations-handler) |
| `Run Application`                 | Try the App with [Affinidi Login & Affinidi Iota Framework](#run-the-application-to-experience-affinidi-iota-framework)                        |

> [!IMPORTANT]
> This Module is an extension of the same Eventi App that we worked on for [**Module 1**](/docs/generate-app.md) & [**Module 2**](/docs/credentials-issuance.md).

## Pre-Requisite

If you have completed [Module 3](./iota-framework-verification.md) go to next step, otherwise would require to complete the steps listed below.

- Iota Configuration should be created as mentioned in [Module 3](./iota-framework-verification.md#configure-affinidi-iota-configuration)
- Install Dependencies as mentioned in [Module 3](./iota-framework-verification.md#install-dependencies)
- Create API to initiate [Iota request](./iota-framework-verification.md#create-api-endpoint-apiiotastart-redirect-flow---initiate-request)
- Create API to get data from the [Iota Initiate request](./iota-framework-verification.md#create-api-endpoint-apiiotaiota-response---get-requested-data)

## Step-by-Step Guide to enable Affinidi Iota Framework

Before proceeding with the steps below, make sure you have completed the prerequisites mentioned above.

> [!WARNING]
> The steps showcased in this sample application are provided only as a guide to quickly explore and learn how to integrate the components of Affinidi Trust Network into your application. This is NOT a Production-ready implementation. Please don't deploy this to a production environment.

Now, let's continue with the step-by-step guide to enable the Affinidi Iota framework in the sample App.

### Add Recommendations PEX in Affinidi Iota Configuration

Add New Presentation Definition for requesting music preferences in Affinidi Iota framework configuration by using the [Affinidi Portal](https://portal.affinidi.com)

1. Login to [Affinidi Portal](https://portal.affinidi.com)

2. Open Your Iota Configuration details by clicking on `Affinidi Iota Framework` menu under `Frameworks` section

3. If Iota Configuration _Data sharing flow mode_ is `Redirect` then Edit the Iota configuration details and add another `Redirect URLs` with new line as `http://localhost:3000/` and then Click `Save` button

4. Click `Edit` button under `Create Presentation Definitions` section to add new presentation definition for requesting music recommendations

5. Click `+ Add` button and providing the name of the Presentation Definition as `Music Recommendations` and then select from the available templates to pre-populate the editor and modify with the below presentation definition to request `Music Recommendations Credential` from the Affinidi Vault.

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

7. Click on `Create` button, `QueryId` for requesting Event Ticket VC is generated.

### Update environment variables

Update `.env` file with the `ConfigurationId` and `QueryId` obtained in previous step

```
NEXT_PUBLIC_IOTA_CONFIG_ID=""
NEXT_PUBLIC_IOTA_MUSIC_RECOMMEND_QUERY=""
```

### Implement Application Code Changes

#### Use React Custom Hook `useIotaQuery` to Request Event Ticket VC

Open the Landing Page component `src\components\LandingPage\index.tsx` which displays list of events, and add the below code snippet which uses react custom hook to initiate the Affinidi Iota Request.

```javascript
//Start of Iota Request
const { handleInitiate, data: iotaRequestData } = useIotaQuery({
  configurationId: iotaConfigId,
});

useEffect(() => {
  if (!iotaRequestData) return;

  //data for recommendations
  const musicData = iotaRequestData[recommendationIota];
  if (musicData) {
    const obj = "" + localStorage.getItem("consumerCurrentState");
    let userUpd: ConsumerInfoProps = JSON.parse(obj);
    const usernew = {
      ...userUpd?.user,
      interest: musicData.categories?.behaviors.interests[0].interest,
      genre: musicData.categories?.music.favoriteGenres[0].favoriteGenre,
    };
    filterProducts(usernew.genre);

    storeConsumerInfo((prev) => ({ ...prev, user: usernew }));
    setHasItem(true);
  }
}, [iotaRequestData]);
//EOD of Iota Request
```

#### Apply Action on Button Click `handleInitiateRecommendations` handler

Invoke `handleInitiate` function on click on the share ticket button handler `handleInitiateRecommendations`

```javascript
//Event Handler
const handleInitiateRecommendations = () => {
  //Initiate Affinidi Iota request
  handleInitiate(recommendationIota);
};
```

### Run The application to experience the Affinidi Iota framework

Try the App with Affinidi Iota Framework and click on `Give Me Recommendations` button on the landing page.

> [!NOTE]
> The Eventi App filters events exclusively by music genres such as `Pop`, `Rock`, `Hip Hop`, and `Jazz`. Try giving one of these values in your Affinidi vault to view the filtered events based on the chosen genre.

```sh
npm run dev
```

Open [http://localhost:3000/](http://localhost:3000/) with your browser to see the result.

## Move to

- [**Module 1: Generating Event Management Application from Affinidi CLI With Affinidi Login**](/docs/generate-app.md)
- [**Module 2: Issue Event Ticket as Verifiable Credential**](/docs/credentials-issuance.md)
- [**Module 3: Building Consent-Driven Data Access for Verification**](/docs/iota-framework-verification.md)
- [**Homepage**](/README.md)

## More Resources for Advanced Learning

- [Affinidi Documentation](https://docs.affinidi.com/docs/affinidi-elements/credential-issuance/)
- [Affinidi Iota Framework](https://docs.affinidi.com/frameworks/iota-framework/)
- [Affinidi Credential Verification](https://docs.affinidi.com/docs/affinidi-elements/credential-verification/)
