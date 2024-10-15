import styled from "styled-components";
import dynamic from "next/dynamic";

const LandingPageClientSide = dynamic(
  () => import("src/components/LandingPage/index"),
  { ssr: false },
);



const Wrapper = styled.div`
  min-height: 100%;
  
`;

const Home = () => {
  return (
    <Wrapper>
      <LandingPageClientSide />
    </Wrapper>
  );
};

export default Home;
