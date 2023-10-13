import { FC } from 'react'

import LandingPage from 'components/LandingPage/LandingPage'
import Tile from 'components/Tile/Tile'
import { useAuthentication } from '../../hooks/auth/useAuthentication'

import DebtIcon from 'public/images/debt-icon.svg'
import FinanceIcon from 'public/images/finance-icon.svg'
import EducationIcon from 'public/images/education-icon.svg'

import styled from 'styled-components'
import Box from '../../components/Box/Box'
import { pxToRem } from 'utils'

const Wrapper = styled.div`
  min-height: 100%;
  padding: 0px ${pxToRem(80)};
`

const TileWrapper = styled(Box)`
 span {
  width: ${pxToRem(138)};
  margin-top: ${pxToRem(3)};
  border-top: 4px solid #ff5722;
 }
`
const TileContainer = styled(Box)`
 
`
const TileHeader = styled.div`
  font-family: 'lato', 'sans-serif';
  font-weight: 700;
  font-size: ${pxToRem(32)};
  margin-top: ${pxToRem(65)};
`

const DID = styled.div`
    font-weight: 700;
    font-size: ${pxToRem(20)};
    margin-bottom: ${pxToRem(10)};
`

const Home: FC = () => {
  const { isAuthenticated, did, email } = useAuthentication()

  return (
    <Wrapper>
      <LandingPage />
     
      <TileWrapper direction='column'>
        <TileHeader>What’s covered?</TileHeader>
        <span />

        <TileContainer direction='row' justifyContent='space-between'>
          <Tile text='Debt and mortgage' icon={DebtIcon}></Tile>
          <Tile text='Lost income' icon={FinanceIcon}></Tile>
          <Tile text='Childcare & education' icon={EducationIcon}></Tile>
        </TileContainer>
      </TileWrapper>
    </Wrapper>
  )
}

export default Home
