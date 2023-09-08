import styled from "styled-components";

import LocalLandingPage from "components/LocalLandingPage/LocalLandingPage";
import LandingPage from "components/LandingPage/LandingPage";

import { pxToRem } from "utils";

import { useAuthentication } from "../../hooks/auth/useAuthentication";
import { useLocalContent } from "../../hooks/useLocalContent";

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
