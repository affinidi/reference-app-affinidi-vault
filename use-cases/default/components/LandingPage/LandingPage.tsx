import { FC } from "react";
import Image from "next/image";
import styled from "styled-components";

import logo from "assets/logo.png";
import Box from "components/Box/Box";
import TilesSection from "components/TilesSection/TilesSection";

import { pxToRem } from "utils";

import * as S from "./LandingPage.styled";

const Space = styled.div`
  height: ${pxToRem(80)};
`;

const LandingPage: FC = () => {
  return (
    <>
      <Space />

      <Box direction="row">
        <S.ContentContainer justifyContent="center">
          <S.Title>
            Insurance
            <div>made easy.</div>
          </S.Title>

          <S.Content>Get coverage in 2 minutes. Cancel monthly.</S.Content>

          <S.ButtonContainer direction="row">
            <S.Button variant="primary">Get Covered</S.Button>
            <S.Button variant="secondary">Learn More</S.Button>
          </S.ButtonContainer>
        </S.ContentContainer>

        <S.Logo direction="row" justifyContent="flex-end" flex={1}>
          <Image src={logo.src} alt="logo" width={777} height={487} />
        </S.Logo>
      </Box>

      <TilesSection />
    </>
  );
};

export default LandingPage;
