# Setup Auth0 social connection with Affinidi Login

> Source: https://auth0.com/docs/authenticate/identity-providers/social-identity-providers/oauth2

## Perquisites

- Setup [Auth0 tenant and application](./auth0/setup-auth0.md)
- Setup [Login Configuration](../setup-login-config.md)

## Setup Auth0 social connection

1. Visit [this link](https://manage.auth0.com/#/connections/social), click **"Create Connection"**:  

   ![Create connection](./images/auth0_create_connection.png)  

   Select **"Create Custom"** and set the following fields with the values below:  

   ![Custom connection](./images/auth0_custom_connection.png)

  - **Authorization URL**: https://euw1.vpa.auth.affinidi.io/oauth2/auth
  - **Token URL**: https://euw1.vpa.auth.affinidi.io/oauth2/token
  - **Scope**: openid offline_access
  - **Client ID**: value from the [Login Configuration](../setup-login-config.md)
  - **Client Secret**: value from the [Login Configuration](../setup-login-config.md)

2. Copy the following code into the **Fetch User Profile Script** field:

```js
function fetchUserProfile(accessToken, context, callback) {
  const idToken = JSON.parse(Buffer.from(context.id_token.split('.')[1], 'base64').toString());

  const profile = {
    user_id: idToken.sub,
    email: idToken.custom.find(c => c.email).email,
    profile: idToken.custom,
  };
  
  callback(null, profile, context);
}
```

4. Click **"Create"** and enable the connection for your application.

   ![Enable connection](./images/auth0_enable_connection.png)  
