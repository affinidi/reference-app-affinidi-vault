import { FC, useEffect, useState } from 'react'
import * as S from './NavBar.styled'
import Box from '../Box/Box'
import Image from 'next/image'

import IconPersonFilled from 'public/images/icon-person-filled.svg'
import { signOut } from 'next-auth/react'
import { useAuthentication } from '../../hooks/auth/useAuthentication'

const NavBar: FC = () => {
  const [isSignInPage, setIsSignInPage] = useState(false)
  const [confirmLogOut, setConfirmLogOut] = useState(false)
  const { email, isAuthenticated, isLoading } = useAuthentication()

  useEffect(() => {
    if (window.location.href.includes('/sign-in')) {
      setIsSignInPage(true)
    } else {
      setIsSignInPage(false)
    }
  }, [])

  useEffect(() => {
    if (confirmLogOut) {
      const timeoutId = setTimeout(() => {
        setConfirmLogOut(false)
      }, 5000)

      return () => clearTimeout(timeoutId)
    }
  }, [confirmLogOut])

  async function handleLogOut() {
    if (!confirmLogOut) {
      setConfirmLogOut(true)
      return
    }
    
    await signOut()
  }

  return (
    <S.Container
      justifyContent='space-between'
      alignItems='center'
      direction='row'
    >
      <S.Title onClick={() => window.location.href = '/'}>INSURANCE</S.Title>

      {!isSignInPage && <>
        <S.NavigationContainer
          justifyContent='space-between'
          alignItems='flex-end'
          direction='row'
        >
          <S.NavTabs>Home</S.NavTabs>
          <S.NavTabs>Products</S.NavTabs>
          <S.NavTabs>Service</S.NavTabs>
          <S.NavTabs>Pricing</S.NavTabs>
          <S.NavTabs>Contact Us</S.NavTabs>
        </S.NavigationContainer>

        <Box style={{ minWidth: 200 }} alignItems='end'>
          {isLoading && <S.Loading>Loading...</S.Loading>}

          {!isLoading && !isAuthenticated && <Box
            justifyContent='end'
            alignItems='center'
            direction='row'
          >
            <S.Button variant='primary' onClick={() => window.location.href = '/sign-in'}>Log In</S.Button>
            <S.Button variant='secondary' onClick={() => window.location.href = '/sign-in'}>Sign Up</S.Button>
          </Box>}

          {!isLoading && isAuthenticated && <S.Account onClick={handleLogOut} direction='row' alignItems='center' justifyContent='end' gap={16}>
            {!confirmLogOut && <S.Avatar>
              <Image src={IconPersonFilled} alt='avatar' />
            </S.Avatar>}
            <S.Email>{confirmLogOut ? 'Log out' : (email || 'My Account')}</S.Email>
          </S.Account>}
        </Box>
      </>}
    </S.Container>
  )
}

export default NavBar
