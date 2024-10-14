# Generating Event Management Application from Affinidi CLI With Affinidi Login

This is a event management reference app (eventi) to demonstrate Zero party data exchange, interoperability of data across business boundaries and consent based data management for applications using Affinidi Login, Affinidi Iota framework, Credential Issuance and Affinidi Vault

## Introduction

we will use Affinidi CLI `generate app command` to kickstart your journey with Affinidi Trust Network by generating reference codes using different programming languages, frameworks, and IAM solutions.

## What you will setup?

![Affinidi CLI Generate App](/docs/images/generate-app.gif)

## Table of content

| Content                               | Description                                                                            |
| ------------------------------------- | -------------------------------------------------------------------------------------- |
| `Pre-Requisite`                       | Complete the [pre-requisite](#pre-requisite) for Affinidi CLI                          |
| `Install Affinidi CLI`                | Install latest version of [Affinidi CLI](#install-affinidi-cli)                        |
| `Start Affinidi CLI`                  | Start Using the [Affinidi CLI](#start-affinidi-cli)                                    |
| `Understanding Affinidi CLI Commands` | Learn more on how to use [Affinidi CLI Commands](#understanding-affinidi-cli-commands) |
| `Generate Eventi App`                 | Generate Eventi App using [Affinidi CLI](#generate-eventi-app-command)                 |
| `Run Application`                     | Run the [Eventi App](#test-the-newly-generated-eventi-app)                             |

## Pre-Requisite

To complete this workshop, you would require few tools as listed below.

- Setup [Affinidi Vault](https://docs.affinidi.com/docs/get-started/#create-an-affinidi-vault-account) account. Follow the guide below if you haven’t set it up yet.
- [NodeJs v18 and higher](https://nodejs.org). (it's recommended to use [nvm](https://github.com/nvm-sh/nvm))
- Install [Git](https://git-scm.com/) to generate a reference app using [affinidi generate app](https://docs.affinidi.com/dev-tools/affinidi-cli/generate-app/) command
- [VS Code](https://code.visualstudio.com/) or similar IDE for development.

> [!NOTE]
> A Cloud IDE like GitPod (https://www.gitpod.io/) has many challenges; hence, it is not recommended for this workshop.

## Install Affinidi CLI

Install the latest version of Affinidi CLI.

```sh
npm install -g @affinidi/cli
```

Uninstall the Affinidi CLI on your machine.

```sh
npm uninstall -g @affinidi/cli
```

## Start Affinidi CLI

Accessing most Affinidi CLI features, like creating a Login Configuration, requires you to authenticate to Affinidi using Affinidi Vault. To do this, you can execute the following command.

```sh
affinidi start
```

If you received a `session expired` error, just run the same command to refresh your session.

## Understanding Affinidi CLI Commands

Commands in Affinidi CLI have the following structure

```
affinidi <topic> <command> [flags]
```

- All commands start with the keyword `affinidi`.
- Topics typically correspond to Affinidi services or domains.
- Commands correspond to the actions to perform.
- Flags are a way to provide the parameters required by the command.
- Use `affinidi help <topic|command>` to show the helpful details.

For More details refer to the [Affinidi CLI](https://docs.affinidi.com/dev-tools/affinidi-cli/#understanding-commands) Documentation

## Generate Eventi App

```sh
affinidi generate app --provider=affinidi --framework=usecase --library=eventi --path=affinidi-eventi-app
```

> [!NOTE]
> Eventi application's `.env` file will automatically updated with below configuration variables.

Follow the instruction as below

<pre><code>
Generating sample app... Generated successfully!
? Automatically configure Affinidi Login? <mark>yes</mark>
Fetching available login configurations... Fetched successfully!
? Select a login configuration to use in your sample app Create new login config
? Enter a name for the login config workshop-eventi
Creating login configuration... Created successfully!
{
  "loginConfig": {
    <b>"clientId": "XXXXXXXXXXX",</b>
    <b>"clientSecret": "XXXXXXXXXXXX",</b>
    <b>"issuer": "XXXXXXXX"</b>
  }
}
 ›   Warning:
 ›   Please save the clientSecret somewhere safe. It will be added to the app env's file. You will not be able to view it again.
 ›
? Configure Personal Access Token to enable features like credential issuance and Affinidi Iota Framework? <mark>yes</mark>
Creating Personal Access Token and assigning app permissions on active project... Created successfully!
{
  <b>"projectId": "XXXXXXXXXX",</b>
  <b>"tokenId": "XXXXXXXXXX",</b>
  <b>"privateKey": "XXXXXXXXX"</b>
}
 ›   Warning:
 ›   Please save the privateKey somewhere safe. It will be added to the app env's file. You will not be able to view it again.
 ›

Please read the generated README for instructions on how to run your sample app

</code></pre>

> [!NOTE]
> Affinidi Login Configuration & Personal Access Token(PAT) is autogenerated and configured during `generate app` process, In case if you want to generate & configure manually using Affinidi CLI command, follow the below steps.
>
> - Generate Affinidi Login Configuration
>
> ```
> affinidi login create-config --name "Eventi" --redirect-uris "http://localhost:3000/api/auth/callback/affinidi"
> ```
>
> - Copy your **Client ID**, **Client Secret** and **Issuer** from your login configuration and paste them into your `.env` file(Create a `.env` file if not exists using command `cp .env.example .env`):
>
> <pre><code>
> PROVIDER_CLIENT_ID="<mark>YOUR_CLIENT_ID</mark>"
> PROVIDER_CLIENT_SECRET="<mark>YOUR_CLIENT_SECRET</mark>"
> PROVIDER_ISSUER="<mark>YOUR_ISSUER</mark>"
> </code></pre>
>
> - Generate Personal Access Token(PAT)
>
> ```
> affinidi token create-token -n WorkshopPAT --auto-generate-key --passphrase "MySecretPassphraseForPAT" --with-permissions --no-input
> ```
>
> - Copy your **projectId**, **tokenId** and **privateKey** from your PAT and paste them into your `.env` file:
>
> <pre><code>
> PROJECT_ID="<mark>YOUR_PROJECT_ID</mark>"
> TOKEN_ID="<mark>YOUR_PAT_TOKEN_ID</mark>"
> PRIVATE_KEY="<mark>YOUR_PAT_PRIVATE_KEY</mark>"
> PASSPHRASE="<mark>PASSPHRASE</mark>"
> </code></pre>

## Test the newly generated eventi app

Start the development server:

1. Install the dependencies

```sh
npm install
```

2. Run the application

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser and try passwordless experience using `Affinidi Login`.

## Next Module

- [**Module 2: Issue Event Ticket as Verifiable Credential**](/docs/credentials-issuance.md)

## Move to

- [**Homepage**](/README.md)

## More Resources for Advanced Learning

- [Affinidi Documentation](https://docs.affinidi.com/docs/affinidi-login/)
- [Affinidi Login](https://docs.affinidi.com/docs/affinidi-login/how-affinidi-login-works/)
- [Affinidi Reference Apps with Language & Frameworks](https://docs.affinidi.com/labs/languages/)
- [Affinidi Login with Identity Management Solution](https://docs.affinidi.com/labs/identity-access-management/)
- [Affinidi Login as 3rd Party plugin](https://docs.affinidi.com/labs/3rd-party-plugins/)
- [Code Samples](https://docs.affinidi.com/other-resources/code-samples/)
