import { FC } from "react";
import Image from "next/image";
import styled from "styled-components";
import { pxToRem } from "src/styles/px-to-rem";
import Input from "src/components/Input/Input";
import Box from "src/components/Box/Box";
import LogoAffinidi from "public/images/logo-affinidi.svg";
import signInImage from "public/images/sign-in.png";
import { clientLogin } from "src/lib/auth/client-login";

const Wrapper = styled.div`
  min-height: 100%;
  padding: ${pxToRem(80)};
`;

const Container = styled(Box)`
  border: solid 1px #e1e2ef;
`;

const Logo = styled(Box)`
  width: ${pxToRem(770)};
`;

const LogInContainer = styled(Box)`
  width: ${pxToRem(507)};
`;

const InnerLogInContainer = styled(Box)`
  width: ${pxToRem(347)};
`;

const Title = styled.div`
  margin-top: ${pxToRem(40)};
  font-size: ${pxToRem(32)};
  font-family: "lora", sans-serif;
  font-weight: 700;

  div {
    line-height: 1;
    color: #ff5722;
  }
`;
const Content = styled.div`
  margin-top: ${pxToRem(24)};
  margin-bottom: ${pxToRem(32)};
  font-size: ${pxToRem(16)};
  font-family: "lato", sans-serif;
  font-weight: 400;
`;

const ButtonContainer = styled(Box)`
  margin-top: ${pxToRem(48)};
`;

const OrContainer = styled(Box)`
  color: #dedede;

  span {
    margin: 0 ${pxToRem(20)};
  }
`;

const Line = styled.div`
  width: 141px;
  height: 1px;
  background-color: #d2d2d2;
`;

const NoAccount = styled.div`
  margin-top: ${pxToRem(52)};
  margin-bottom: ${pxToRem(44)};
  font-family: "lato", sans-serif;
  font-size: ${pxToRem(14)};
`;

const Bold = styled.span`
  margin-left: ${pxToRem(8)};
  font-size: ${pxToRem(16)};
  font-family: "lato", sans-serif;
  font-weight: 700;
  color: #10375c;
`;

const Button = styled.button<{ variant: "primary" | "secondary" }>`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  padding: ${pxToRem(12)} ${pxToRem(24)};
  color: #ff5722;
  font-family: "lato", sans-serif;
  cursor: pointer;
  box-shadow: 0 4px 16px 0 rgba(255, 87, 34, 0.32);

  button:nth-of-type(1) {
    margin-right: ${pxToRem(12)};
  }

  img {
    margin-right: ${pxToRem(16)};
  }

  ${({ variant }) =>
    variant === "primary"
      ? `
      background: #1d58fc;
      color:#fff;
      box-shadow: 0 4px 16px 0 rgba(55, 62, 151, 0.32);
      margin-top:${pxToRem(44)};
    `
      : `
      background: #ff5722;
      color: #fff;
      box-shadow: 0 4px 16px 0 rgba(255, 87, 34, 0.32);
      margin-bottom:${pxToRem(44)};
    `}
`;

const LogIn: FC = () => {
  return (
    <Wrapper>
      <Container direction="row">
        <Logo direction="row" justifyContent="flex-start" flex={1}>
          <Image
            src={signInImage.src}
            alt="sign in"
            width={777}
            height={487}
            style={{ objectFit: "cover" }}
          />
        </Logo>

        <LogInContainer justifyContent="center" alignItems="center">
          <InnerLogInContainer>
            <Title>Sign In</Title>

            <Content>Please enter a your email address to sign in.</Content>

            <Input
              id="email"
              type="email"
              label="Email"
              placeholder="example@affinidi.com"
            />

            <ButtonContainer direction="column">
              <Button variant="secondary">Log In</Button>

              <OrContainer
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <Line />
                <span>OR</span>
                <Line />
              </OrContainer>

              <Button variant="primary" onClick={clientLogin}>
                <Image src={LogoAffinidi} alt="logo affinidi" />
                Affinidi Login
              </Button>
            </ButtonContainer>

            <NoAccount>
              Don&apos;t have an account yet?<Bold>SIGN UP</Bold>
            </NoAccount>
          </InnerLogInContainer>
        </LogInContainer>
      </Container>
    </Wrapper>
  );
};

export default LogIn;
