'use strict';
import jwt from 'jsonwebtoken';
import firebaseConfig from './firebase-config.json';

/**
 * This function generates the signed token that is required by Firebase for carrying out
 * user authentication. Refer : https://firebase.google.com/docs/auth/web/custom-auth for details
 * 
 * This token would then be passed to Firebase-sdk for authentication, which then issues an id-token
 * for the the user, after successful authentication
 * 
 * @param {*} uid : User identifier for which a signed token has to be generated
 * @returns 
 */
export function generateSignedTokenForFirebaseAuthentication(uid){
    
    /* 
     Refer https://firebase.google.com/docs/auth/admin/create-custom-tokens#create_custom_tokens_using_a_third-party_jwt_library
     for structure of the token required by Firebase
     */

    const FIREBASE_AUDIENCE = 'https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit';
    const iat = Math.floor(Date.now() / 1000);
    const ONE_HOUR_IN_SECONDS = 60 * 60;
    const FIREBASE_SCOPE = 'https://www.googleapis.com/auth/identitytoolkit';
    const FIREBASE_TOKEN_ALGO = 'RS256'; 
    
    const body = { 
        aud: FIREBASE_AUDIENCE,
        iat,
        exp: iat + ONE_HOUR_IN_SECONDS,
        iss: firebaseConfig.client_email,
        sub: firebaseConfig.client_email,
        uid,
        scope: FIREBASE_SCOPE
    };

    // Sign the token with the Firebase project's private key
    var token = jwt.sign(body, firebaseConfig.private_key, {algorithm: FIREBASE_TOKEN_ALGO, keyid: firebaseConfig.private_key_id});
    return token;
}


export function firebaseCred(){
    return { apiKey: firebaseConfig.api_key };
}