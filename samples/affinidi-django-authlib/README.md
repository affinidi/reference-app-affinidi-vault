# Affinidi login demo with Django

This is a template that showcases how to use Affinidi Vault to perform authentication and to interact with the vault. It accomplishes this through Affinidi Vault Chrome Extension using the [OpenID for Verifiable Presentations specification.](https://openid.net/specs/openid-4-verifiable-presentations-1_0.html)

First, copy `.env.example` to `.env`:

```
cp .env.example .env
```

## Install

Install the required dependencies:

```
pip install -r requirements.txt
```

## Create Login Configuration and update .env

Create your Affinidi Login Configuration with the [Affinidi CLI](https://github.com/affinidi/affinidi-cli#set-up-affinidi-login-for-your-applications) or at [Affinidi Portal](https://portal.affinidi.com/), make sure to add `http://localhost:8000/callback` into authorized redirect URIs.

Please read the [setup login config guide](./docs/setup-login-config.md) to understand more about setting up login configuration.

Fill the client ID, secret and issuer URL in `.env` file

then run:

```
python manage.py migrate
```

## Run

Start server with:

```
python manage.py runserver
```

Then visit: http://localhost:8000

## Read More

Explore our [documentation](https://docs.affinidi.com/docs/) and [labs](https://docs.affinidi.com/labs/) to learn more about integrating Affinidi Login with Affinidi Vault.

## Telemetry

Affinidi collects usage data to improve our products and services. For information on what data we collect and how we use your data, please refer to our [Privacy Notice](https://www.affinidi.com/privacy-notice).

## Feedback, Support, and Community

[Click here](https://github.com/affinidi/reference-app-affinidi-vault/issues) to create a ticket and we will get on it right away. If you are facing technical or other issues, you can reach out to us on [Discord](https://discord.com/invite/jx2hGBk5xE).

## FAQ

### A note from Affinidi

Affinidi Developer Tools are currently in the open beta phase and we are refining our product every day. The Affinidi Developer Tools may be incomplete and may contain errors – they may be unstable and may cause a loss of functionality and data. Use of the Affinidi Developer Tools will be at your own risk. As our engineers seek to improve our platform, we would not have the resources to provide any maintenance or tech support at this time. Please bear with us as we continue to improve the platform.

### What can I develop?

You are only limited by your imagination! Affinidi Developer Tools is a toolbox with which you can build software apps for personal or commercial use.

### Is there anything I should not develop?

We only provide the tools - how you use them is largely up to you. We have no control over what you develop with our tools - but please use our tools responsibly!

We hope that you would not develop anything that contravenes any applicable laws or regulations. Your projects should also not infringe on Affinidi’s or any third party’s intellectual property (for instance, misusing other parties’ data, code, logos, etc).

### What responsibilities do I have to my end-users?

Please ensure that you have in place your own terms and conditions, privacy policies, and other safeguards to ensure that the projects you build are secure for your end users.

If you are processing personal data, please protect the privacy and other legal rights of your end-users and store their personal or sensitive information securely.

Some of our components would also require you to incorporate our end-user notices into your terms and conditions.

### Are Affinidi Developer Tools free for use?

Affinidi Developer Tools are free during the open beta phase, so come onboard and experiment with our tools and see what you can build! We may bill for certain components in the future, but we will inform you beforehand.

### Is there any limit or cap to my usage of the Affinidi Developer Tools?

We may from time to time impose limits on your use of the Affinidi Developer Tools, such as limiting the number of API requests that you may make in a given duration. This is to ensure the smooth operation of the Affinidi Developer Tools so that you and all our other users can have a pleasant experience as we continue to scale and improve the Affinidi Developer Tools.

### Do I need to provide you with anything?

From time to time, we may request certain information from you to ensure that you are complying with the [Terms and Conditions](https://www.affinidi.com/terms-conditions).

### Can I share my developer’s account with others?

When you create a developer’s account with us, we will issue you your private login credentials. Please do not share this with anyone else, as you would be responsible for activities that happen under your account. If you have friends who are interested, ask them to sign up – let's build together!

## _Disclaimer_

_Please note that this FAQ is provided for informational purposes only and is not to be considered a legal document. For the legal terms and conditions governing your use of the Affinidi Developer Tools, please refer to our [Terms and Conditions](https://www.affinidi.com/terms-conditions)._
