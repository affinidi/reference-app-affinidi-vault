# Affinidi Login Reference App 

This project is a .NET 8.0 Razor web app, utilizing the power of Razor Pages for building dynamic web pages.

## Getting Started

These instructions will help you to make this project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following tools installed on your machine:

- [.NET SDK 8.0](https://dotnet.microsoft.com/download)
- [Visual Studio code](https://code.visualstudio.com/) (or any preferred code editor)

    #### PreRequisite check 

    Run this command to get the Dotnet version 
    ```sh 
    dotnet --version 
    ```

    You should get Output as, please reinstal if dotet version is not 8.0.xxx
    ```sh
    8.0.100
    ```
### Navigate to the project directory:
```sh
cd Affinidi-Login-Reference-App
```


### Create Login Configuration

Create your Affinidi Login Configuration with the [Affinidi CLI](https://github.com/affinidi/affinidi-cli#set-up-affinidi-login-for-your-applications) or at [Affinidi Portal](https://portal.affinidi.com/).

Make sure to add `http://localhost:5068/signin-oidc` into authorized redirect URIs.

Please read the [setup login config guide](./docs/setup-login-config.md) to understand more about setting up login configuration.

Fill the client ID, secret and issuer URL in `appsettings.json` file

### Update App settings:

Update the following fields in appsettings.json from data generated from previous step for `OpenIDConnect`.

`ClientId:` Client ID generated during create login configuration

`ClientSecret:` Client Secret generated during create login configuration

`Issuer:` Issuer Url from Login configuration 



### Build and run the project:

```sh
dotnet build
dotnet run
```


Then visit: http://localhost:5068/ to browse reference app

## Read More

Explore our [documentation](https://docs.affinidi.com/docs/) and [labs](https://docs.affinidi.com/labs/) to learn more about integrating Affinidi Login with Affinidi Vault.

## Telemetry

Affinidi collects usage data to improve our products and services. For information on what data we collect and how we use your data, please refer to our [Privacy Notice](https://www.affinidi.com/privacy-notice).

## Feedback, Support, and Community

[Click here](https://github.com/affinidi/reference-app-affinidi-vault/issues) to create a ticket and we will get on it right away. If you are facing technical or other issues, you can [Contact Support](https://share.hsforms.com/1i-4HKZRXSsmENzXtPdIG4g8oa2v).


## FAQ

### What can I develop?

You are only limited by your imagination! Affinidi Reference Applications are a toolbox with which you can build software apps for personal or commercial use.

### Is there anything I should not develop?

We only provide the tools - how you use them is largely up to you. We have no control over what you develop with our tools - but please use our tools responsibly!

We hope that you would not develop anything that contravenes any applicable laws or regulations. Your projects should also not infringe on Affinidi’s or any third party’s intellectual property (for instance, misusing other parties’ data, code, logos, etc).

### What responsibilities do I have to my end-users?

Please ensure that you have in place your own terms and conditions, privacy policies, and other safeguards to ensure that the projects you build are secure for your end users.

If you are processing personal data, please protect the privacy and other legal rights of your end-users and store their personal or sensitive information securely.

Some of our components would also require you to incorporate our end-user notices into your terms and conditions.

### Are Affinidi Reference Applications free for use?

Affinidi Reference Applications are free, so come onboard and experiment with our tools and see what you can build! We may bill for certain components in the future, but we will inform you beforehand.

### Do I need to provide you with anything?

From time to time, we may request certain information from you to ensure that you are complying with the [Terms and Conditions](https://www.affinidi.com/terms-conditions).

### Can I share my developer’s account with others?

When you create a developer’s account with us, we will issue you your private login credentials. Please do not share this with anyone else, as you would be responsible for activities that happen under your account. If you have friends who are interested, ask them to sign up – let's build together!

## _Disclaimer_

_Please note that this FAQ is provided for informational purposes only and is not to be considered a legal document. For the legal terms and conditions governing your use of the Affinidi Reference Applications, please refer to our [Terms and Conditions](https://www.affinidi.com/terms-conditions)._

