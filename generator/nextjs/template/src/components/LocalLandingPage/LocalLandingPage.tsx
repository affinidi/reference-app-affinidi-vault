import Image from "next/image";
import styled from "styled-components";

import Box from "src/components/Box/Box";
import WelcomeBanner from "src/components/WelcomeBanner/WelcomeBanner";
import TilesSection from "src/components/TilesSection/TilesSection";

import { pxToRem } from "src/styles/px-to-rem";
import { useLocalContent } from "src/lib/hooks/use-local-content";

import logo from "public/images/german-logo.png";

import * as S from "./LocalLandingPage.styled";

const Space = styled.div`
  height: ${pxToRem(80)};
`;

const LocalLandingPage = () => {
  const { country } = useLocalContent();

  return (
    <>
      <WelcomeBanner />

      <Box direction="row">
        <S.ContentContainer justifyContent="center">
          <S.Title>
            Personal liability insurance <span>for {country}</span>
          </S.Title>

          <S.Content>Get coverage in 2 minutes. Cancel monthly.</S.Content>

          <S.ButtonContainer direction="row">
            <S.Button variant="primary">Get Covered</S.Button>
            <S.Button variant="secondary">Learn More</S.Button>
          </S.ButtonContainer>
        </S.ContentContainer>

        <S.Logo direction="row" justifyContent="flex-end" flex={1}>
          <Image
            src={logo.src}
            alt="logo"
            width={777}
            height={487}
            style={{ objectFit: "cover" }}
          />
        </S.Logo>
      </Box>

      <TilesSection />
    </>
  );
};

export default LocalLandingPage;
