import { FC } from 'react'
import Image from 'next/image'
import { useAuthentication } from '../../hooks/auth/useAuthentication'

import logo from 'assets/logo.png'
import Box from '../Box/Box'

import * as S from './LandingPage.styled'
import { initializeApp } from "firebase/app";
import { getAuth, signInWithCustomToken, signOut } from "firebase/auth";
import { generateSignedTokenForFirebaseAuthentication, firebaseCred}  from "../../firebase";

const LandingPage: FC = () => {
  const { isAuthenticated, email, did } = useAuthentication()

  function loginToFirebase() {
    // Initialize Firebase
   initializeApp(firebaseCred());
   const auth = getAuth();

   // Generate Custom Token for firebase login
   const customToken = generateSignedTokenForFirebaseAuthentication(email);

   signInWithCustomToken(auth, customToken)
       .then((userCredential) => {
         document.getElementById('fbase-login').style = 'display: block';
         document.getElementById('fbase-init').style = 'display: none';
         document.getElementById('fbase-activetill').innerHTML = JSON.stringify(userCredential, maskTokens, 4);
     })
     .catch((error) => {
       console.log('firebase : Failure to Authenticate. '+error.code+ ' : '+error.message);
     });
  }

  function maskTokens(key, value) {
    if( (key === 'refreshToken') || (key === 'idToken') || (key === 'accessToken')){
      return "----Value Masked----";
    }
    return value;
  }
  
  function logoutFirebase(){
    const auth = getAuth();
    signOut(auth).then(() => {
        // Sign-out successful.
        document.getElementById('fbase-login').style = 'display: none';
        document.getElementById('fbase-init').style = 'display: block';
        document.getElementById('fbase-activetill').innerHTML = '';
      }).catch((error) => {
        console.log('firebase : Failure to log-out. '+error.code+ ' : '+error.message);
      });
  }


  return (
    <Box direction='row'>
      <S.ContentContainer justifyContent='center'>
      
        <div style={{display: isAuthenticated ? 'block' : 'none' }}>
                <div id = "fbase-init">
                  <S.Title>You are currently logged-in as <div>{did}</div></S.Title>
                  
                  <S.Content>&nbsp;</S.Content>

                  <S.Button variant='primary' onClick={loginToFirebase}>Get Firebase Credentials for logged-in user</S.Button>
                </div>
                <div id= "fbase-login" style={{display: 'none' }}>
                    <S.Button variant='primary' onClick={logoutFirebase}>Logout Firebase</S.Button>
                    <S.Content><p id = "fbase"> Firebase Authentication Response : <br/><br/></p>
                    <pre id= "fbase-activetill"></pre></S.Content>
                </div>
            </div>

      </S.ContentContainer>

      <S.Logo direction='row' justifyContent='flex-end' flex={1}>
        <Image src={logo.src} alt='logo' width={700} height={487} />
      </S.Logo>
    </Box>
  )
}

export default LandingPage