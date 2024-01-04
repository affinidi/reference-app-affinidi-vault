<?php
return [
    'callback' => env('APP_URL') . '/login/affinidi/callback',
    'keys' => [
        'id' => env('PROVIDER_CLIENT_ID'),
        'secret' => env('PROVIDER_CLIENT_SECRET')
    ],
    'endpoints' => [
        'api_base_url' => env('PROVIDER_ISSUER'),
        'authorize_url' => env('PROVIDER_ISSUER') . '/oauth2/auth',
        'access_token_url' => env('PROVIDER_ISSUER') . '/oauth2/token',
    ]
]
    ?>