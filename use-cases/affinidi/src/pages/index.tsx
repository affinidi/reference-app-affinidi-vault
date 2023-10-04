import styled from "styled-components";

import LocalLandingPage from "src/components/LocalLandingPage/LocalLandingPage";
import LandingPage from "src/components/LandingPage/LandingPage";

import { pxToRem } from "src/styles/px-to-rem";

import { useAuthentication } from "src/lib/hooks/use-authentication";
import { useLocalContent } from "src/lib/hooks/use-local-content";

const Wrapper = styled.div`
  min-height: 100%;
  padding: 0px ${pxToRem(80)};
`;

const Home = () => {
  const { isAuthenticated } = useAuthentication();
  const { country } = useLocalContent();

  if (!isAuthenticated || !country)
    return (
      <Wrapper>
        <LandingPage />
      </Wrapper>
    );

  return (
    <Wrapper>
      <LocalLandingPage />
    </Wrapper>
  );
};

export default Home;
