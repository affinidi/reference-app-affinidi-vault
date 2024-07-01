var express = require('express');
var cors = require('cors');
require('dotenv').config()
const { Issuer, generators } = require('openid-client');

var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 3001;

const code_verifier = generators.codeVerifier();

const getClient = async () => {
    try {
        const affinidi = await Issuer.discover(process.env.PROVIDER_ISSUER);
        const client = new affinidi.Client({
            client_id: process.env.PROVIDER_CLIENT_ID,
            redirect_uris: [process.env.PROVIDER_REDIRECT_URL],
            response_types: ['code'],
            token_endpoint_auth_method: 'none',
        })
        return client;

    } catch (error) {
        return reject('getClient', error);
    }
};

const initializeServer = async () => {

    app.get('/', function (req, res, next) {
        res.json({ success: 'Express' });
    });

    app.use(cors({ credentials: true, origin: true }));
    app.set('trust proxy', 1);

    app.get('/api/affinidi-auth/init', async (req, res, next) => {

        const state = generators.state();
        //const code_verifier = generators.codeVerifier();
        const params = {
            code_challenge: generators.codeChallenge(code_verifier),
            code_challenge_method: 'S256',
            response_type: 'code',
            scope: 'openid',
            state,
        }

        const client = await getClient();

        const authorizationUrl = client.authorizationUrl(params);

        res.send({ authorizationUrl });
    });

    app.post('/api/affinidi-auth/complete', async (req, res, next) => {

        const { code, state } = req.body;
        if (!code || !state || !code_verifier) {
            res.status(400).send({
                error: 'Invalid data code/state is missing'
            });
            return;
        }
        try {

            const client = await getClient();

            const tokenSet = await client.callback(process.env.PROVIDER_REDIRECT_URL, { code, state },
                { state, code_verifier: code_verifier });
            console.log('tokenSet', tokenSet);

            const id_token = tokenSet.id_token;
            const token = JSON.parse(Buffer.from(id_token.split('.')[1], 'base64').toString());

            console.log('id_token', token);
            const user = {
                ...token
            };

            res.send({ user });
        } catch (error) {
            res.status(400).send({
                error: error.message
            });
        }

    });


    app.listen(PORT, () => {
        console.log(`Server listening on ${PORT}`);
    });

}

initializeServer();
