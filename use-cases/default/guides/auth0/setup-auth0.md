# Setup Auth0 tenant & application

> Source: https://auth0.com/docs/quickstart/webapp/nextjs/interactive

1. Visit https://auth0.com/ to create a new account or login to existing one.

2. Setup your first tenant.  

   ![Setup tenant](./images/auth0_setup_tenant.png)

3. Go to **Applications** page (in your sidebar) and click **"+ Create Application**" button  

   ![Applications](./images/auth0_applications.png)

   > Note: You can use "Default App" pregenerated for you by Auth0.

4. Choose **"Regular Web Applications"** type  

   ![Create application](./images/auth0_create_application.png)

5. Copy your **Domain**, **Client ID** and **Client Secret** from application settings and paste them into your `.env` file:

   ![Application credentials](./images/auth0_application_credentials.png) 

   ![.env file](./images/auth0_env_file.png)

   > Note: Add `https://` protocol to the domain.

6. Scroll down and set **Allowed Callback URLs** to `http://localhost:3000/api/auth/callback/auth0`, **Allowed Logout URLs** to `http://localhost:3000` and **Allowed Web Origins** to `http://localhost:3000`: 

   ![Callback configuration](./images/auth0_callback_configuration.png) 

7. Don't change anything else and click **"Save Changes"** button at the bottom of the settings page.

8. Follow guides to setup [Auth0 Social Connection with Affinidi Login](./setup-social-connection.md) and [Login Configuration](../setup-login-config.md)

