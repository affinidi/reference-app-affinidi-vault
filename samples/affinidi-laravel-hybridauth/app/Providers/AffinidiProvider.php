<?php

namespace App\Providers;

use Hybridauth\Adapter\OAuth2;
use Hybridauth\Data;
use Hybridauth\User;

class AffinidiProvider extends OAuth2
{
    /**
     * Defaults scope to requests
     */
    protected $scope = 'openid offline_access';

    /**
     * Default Base URL to provider API
     */
    protected $apiBaseUrl = '';

    /**
     * Default Authorization Endpoint
     */
    protected $authorizeUrl = '';

    /**
     * Default Access Token Endpoint
     */
    protected $accessTokenUrl = '';

    /* optional: set any extra parameters or settings */
    protected function initialize()
    {

        parent::initialize();

        /* optional: determine how exchange Authorization Code with an Access Token */
        $this->tokenExchangeParameters = [
            'client_id' => $this->clientId,
            'client_secret' => $this->clientSecret,
            'grant_type' => 'authorization_code',
            'redirect_uri' => $this->callback
        ];

    }

    private function extractUser($token)
    {
        $info = json_decode(base64_decode(str_replace('_', '/', str_replace('-', '+', explode('.', $token)[1]))), true);
        $custom = $info['custom'];
        $values = [];
        foreach ($custom as $key => $value) {
            $values[key($value)] = current($value);
        }
        unset($info['custom']);
        $user = array_merge($info, $values);

        return $user;
    }

    function getUserProfile()
    {

        $id_token = $this->getStoredData('id_token');

        // get the user details from ID token
        $data = $this->extractUser($id_token);

        // Below is user profile object from hybridauth
        $collection = new Data\Collection($data);
        $userProfile = new User\Profile();
        $userProfile->identifier = $collection->get('did');
        $userProfile->email = $collection->get('email');
        $userProfile->firstName = $collection->get('givenName');
        $userProfile->lastName = $collection->get('familyName');
        $userProfile->displayName = $collection->get('givenName') . ' ' . $collection->get('familyName');
        $userProfile->profileURL = $collection->get('picture');
        $userProfile->gender = $collection->get('gender');
        $userProfile->phone = $collection->get('phoneNumber');
        $userProfile->address = $collection->get('formatted');
        $userProfile->country = $collection->get('country');
        $userProfile->city = $collection->get('locality');
        $userProfile->zip = $collection->get('postalCode');

        return $userProfile;
    }

    protected function validateAccessTokenExchange($response)
    {
        $collection = parent::validateAccessTokenExchange($response);

        $this->storeData('id_token', $collection->get('id_token'));

        return $collection;
    }


}