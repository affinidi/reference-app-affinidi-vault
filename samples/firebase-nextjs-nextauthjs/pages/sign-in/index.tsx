import { FC } from 'react'
import { signIn } from 'next-auth/react'
import Image from 'next/image'

import { hostUrl } from '../../utils/env_public'
import Input from 'components/Input/Input'

import LogoAffinidi from 'public/images/logo-affinidi.svg'
import signInImage from 'assets/sign-in.png'

import styled from 'styled-components'
import Box from '../../components/Box/Box'
import { pxToRem } from 'utils'


const Wrapper = styled.div`
  min-height: 100%;
  padding: ${pxToRem(80)};
`

const Container = styled(Box)`
  border: solid 1px #e1e2ef;
`

const Logo = styled(Box)`
  width: ${pxToRem(770)};
`

const LogInContainer = styled(Box)`
  width: ${pxToRem(507)};
`

const InnerLogInContainer = styled(Box)`
  width: ${pxToRem(347)};
`

const Title = styled.div`
  margin-top: ${pxToRem(40)};
  font-size: ${pxToRem(32)};
  font-family: 'Poppins', sans-serif;
  font-weight: 700;

  div {
    line-height: 1;
    color: #ff5722;
  }
`
const Content = styled.div`
  margin-top: ${pxToRem(24)};
  margin-bottom: ${pxToRem(32)};
  font-size: ${pxToRem(16)};
  font-family: 'lato', sans-serif;
  font-weight: 400;
`

const ButtonContainer = styled(Box)`
  margin-top: ${pxToRem(48)};
`

const OrContainer = styled(Box)`
  color: #dedede;

  span {
    margin: 0 ${pxToRem(20)};
  }
`

const Line = styled.div`
  width: 141px;
  height: 1px;
  background-color: #d2d2d2;
`

const NoAccount = styled.div`
  margin-top: ${pxToRem(52)};
  margin-bottom: ${pxToRem(44)};
  font-family: 'Poppins', 'sans-serif';
  font-size: ${pxToRem(14)};
`

const Bold = styled.span`
  margin-left: ${pxToRem(8)};
  font-size: ${pxToRem(16)};
  font-family: 'Poppins', 'sans-serif';
  font-weight: 700;
  color: #10375c;
`

const Button = styled.button<{ variant: 'primary' | 'secondary' }>`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  padding: ${pxToRem(12)} ${pxToRem(24)};
  color: #ff5722;
  font-family: 'lato', 'sans-serif';
  cursor: pointer;

  button:nth-of-type(1) {
    margin-right: ${pxToRem(12)};
  }

  img {
    margin-right: ${pxToRem(12)};
  }

  ${({ variant }) =>
    variant === 'primary'
      ? `
      background: #373e97;
      color:#fff;
      margin-top:${pxToRem(52)};
    `
      : `
      background: #ff5722;
      color: #fff;
      margin-bottom:${pxToRem(52)};
    `}
`

const LogIn: FC = () => {
  async function logIn() {
    await signIn('Affinidi', { callbackUrl: hostUrl })
    
  }

  return (
    <Wrapper>
      <Container direction='row'>
        <Logo direction='row' justifyContent='flex-start' flex={1}>
          <Image src={signInImage.src} alt='sign in' width={777} height={487} style={{ objectFit: 'cover' }} />
        </Logo>

        <LogInContainer justifyContent='center' alignItems='center'>
          <InnerLogInContainer>
            <ButtonContainer direction='column'>

              <Button variant='primary' onClick={logIn}>
                <Image src={LogoAffinidi} alt='logo affinidi' />
                Log in with Affinidi
              </Button>
            </ButtonContainer>
            
          </InnerLogInContainer>
        </LogInContainer>
      </Container>
    </Wrapper>
  )
}

export default LogIn
