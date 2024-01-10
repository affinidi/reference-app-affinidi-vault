<?php

return [


    'affinidi' => [
        'base_uri' => env('PROVIDER_ISSUER'),
        'client_id' => env('PROVIDER_CLIENT_ID'),
        'client_secret' => env('PROVIDER_CLIENT_SECRET'),
        'redirect' => '/login/affinidi/callback',
    ],

];
