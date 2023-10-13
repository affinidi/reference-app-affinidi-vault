# Affinidi Vault & Chrome Extension – an Affinidi reference app

This is a sample reference app that showcases how to use Affinidi Vault to perform authentication. It enables a passwordless experience for the end-users through Affinidi Vault Chrome Extension using the [OpenID for Verifiable Presentations specification.](https://openid.net/specs/openid-4-verifiable-presentations-1_0.html)

> This is a sample code only to quickly explore and learn how to integrate Affinidi Login into your own application. 

***Important: This is not a Production-ready implementation. Do not deploy this to production and use this only as a guide.***

## Before you begin

1. This reference application is built using [NextJS](https://nextjs.org/) and [NextAuth.js](https://next-auth.js.org/)

2. You need to have [NodeJS](https://nodejs.org/en) installed on your machine to install the dependencies and run the application.

## Running the app

Setting up the reference app is easy, just follow these steps:  

1. Install the dependencies:
    ```
    $ npm install
    ```
2. Create a `.env` file:
    ```
    $ cp .env.example .env
    ```
    
3. Launch the app:
    ```
    $ npm run dev
    ```
    
    App will be available locally on http://localhost:3000.