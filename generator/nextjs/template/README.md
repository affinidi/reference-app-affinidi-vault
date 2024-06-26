
## Introduction

This is a reference app generated by Affinidi CLI tool with `nextjs` Framework, `nextauthjs` Library

## Getting started 

Setting up the reference app is easy, just follow these steps:

1. Install the dependencies:
   ```
   npm install
   ```
2. Create a `.env` file:

   ```
   cp .env.example .env
   ```

3. Set up environment variables. Please read the [configuration guide](./docs/configuration.md).

4. (Optional for credential issuance) Setup `Personal Access Token` (PAT) Using Affinidi CLI. Please read the [PAT guide](./docs/pat.md).
   
5. (Optional for credential issuance) Create `Credential Issuance Configuration` in `Affinidi Portal`. Please read the [Credential Issuance guide](./docs/cis-guide.md) here.

6. Launch the app:

   ```
   npm run dev
   ```

   App will be available locally on [http://localhost:3000](http://localhost:3000).

**Important**

Use the same project for all your configuration like Personal Access Token (PAT), Credential Issuance & Affinidi Login

In `Affinidi CLI`, to list all your projects run: `affinidi project list-projects`
In `Affinidi CLI`, to change the active project run:` affinidi project select-project -i <project-id>`

## Read More

Explore our [documentation](https://docs.affinidi.com/docs/) and [labs](https://docs.affinidi.com/labs/) to learn more about integrating Affinidi Login with Affinidi Vault.

## Tools & frameworks

This project is built with **NextJS** framework, which allows you to quickly build apps using **TypeScript** and **React**. NextJS has built-in router, server-side rendering and backend support.
Read [NextJS docs](https://nextjs.org/docs/getting-started), [React docs](https://reactjs.org/docs/getting-started.html).
