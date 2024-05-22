# Introduction

This is a reference app generated by Affinidi CLI tool with Java and Springboot framework



## Prerequisite 

1. Make sure you have [JAVA 21](https://jdk.java.net/21/) installed on your machine. Run the following command in a terminal session to check the java version

```sh 
   java --version 
```
You should get an output as below. If not, please reinstall java21 using the link above
```sh
openjdk 21.0.2 2024-01-16
```
2. Ensure that your JAVA_HOME environment variable is set to the installation directory
```sh
export JAVA_HOME="/usr/local/opt/openjdk"
```
3. Optionally you can add this entry to your respective profile (~/.bashrc or ~/.zshrc)


## Getting Started

Setting up the reference app is easy, just follow these steps:

1. Install the dependencies
```sh
sh mvnw clean
sh mvnw install
```

2. Create Login Configuration

To integrate Affinidi Login into your application and offer a passwordless login experience, you need to create a Login Configuration.
Follow [login config setup guide](./README-LOGINCONFIG.md) to create a login configuration for this application.

For current java-springboot application use `http://localhost:8080/login/oauth2/code/javademo` as redirect-uri.

3. Update application environment variables 

Create a .env file for your application to hold environment variables

```sh
cp .env.example .env
```

Update the ClientId, ClientSecret and Issuer received from creating the login configuration into the .env file.
* Do not enclose these values with '' while updating. As an example, this is how your .env should look like

```
PROVIDER_CLIENT_ID=7eeeeee-cccc-bbbb-aaaa-6fffffff
PROVIDER_CLIENT_SECRET=7abcdefgh.8ijklmnopqr
PROVIDER_ISSUER=https://1234567-aaaa-bbbb-cccc-d123456789.apse1.login.affinidi.io
```

`PROVIDER_CLIENT_ID:` Client ID generated during create login configuration

`PROVIDER_CLIENT_SECRET:` Client Secret generated during create login configuration

`PROVIDER_ISSUER:` Issuer Url from Login configuration 

## Build and run the project:

```sh
sh mvnw spring-boot:run
```
Then visit: http://localhost:8080/ to browse the reference app

## Read More

Explore our [documentation](https://docs.affinidi.com/docs/) and [labs](https://docs.affinidi.com/labs/) to learn more about integrating Affinidi Login with Affinidi Vault.

## Telemetry

Affinidi collects usage data to improve our products and services. For information on what data we collect and how we use your data, please refer to our [Privacy Notice](https://www.affinidi.com/privacy-notice).

## Feedback, Support, and Community

[Click here](https://github.com/affinidi/reference-app-affinidi-vault/issues) to create a ticket and we will get on it right away. If you are facing technical or other issues, you can [Contact Support](https://share.hsforms.com/1i-4HKZRXSsmENzXtPdIG4g8oa2v).


## FAQ

### What can I develop?

You are only limited by your imagination! Affinidi Reference Applications is a toolbox with which you can build software apps for personal or commercial use.

### Is there anything I should not develop?

We only provide the tools - how you use them is largely up to you. We have no control over what you develop with our tools - but please use our tools responsibly!

We hope that you will not develop anything that contravenes any applicable laws or regulations. Your projects should also not infringe on Affinidi’s or any third party’s intellectual property (for instance, misusing other parties’ data, code, logos, etc).

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