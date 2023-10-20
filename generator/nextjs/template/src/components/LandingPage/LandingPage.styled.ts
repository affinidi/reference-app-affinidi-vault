import styled from "styled-components";

import Box from "../Box/Box";
import { pxToRem } from "src/styles/px-to-rem";

export const Logo = styled(Box)`
  width: ${pxToRem(770)};
`;
export const ContentContainer = styled(Box)`
  width: ${pxToRem(370)};
`;

export const Title = styled.div`
  font-size: ${pxToRem(52)};
  font-family: "lora", sans-serif;
  font-weight: bold;
  color: #10375c;

  div {
    line-height: 1;
    color: #ff5722;
  }
`;
export const Content = styled.div`
  margin-top: ${pxToRem(32)};
  font-size: ${pxToRem(20)};
  font-family: "lato", sans-serif;
  font-weight: 400;
`;

export const ButtonContainer = styled(Box)`
  margin-top: ${pxToRem(48)};
`;

export const Button = styled.button<{ variant: "primary" | "secondary" }>`
  display: flex;
  align-items: center;
  text-align: center;
  background: #10375c;
  width: 140px;
  height: 43px;
  padding: 12px 24px;
  font-family: "lato", sans-serif;
  font-size: ${pxToRem(16)};
  font-weight: 700;
  cursor: pointer;
  margin-right: ${pxToRem(24)};

  ${({ variant }) =>
    variant === "primary"
      ? `
      background: #10375c;
      color:#fff;
      box-shadow: 0 4px 16px 0 rgba(16, 55, 92, 0.32);

    `
      : `
      background: #fff;
      color: ##10375c;
      border: 1px solid #10375c;
    `}
`;

export const SubscribeLink = styled.div`
  margin-top: ${pxToRem(32)};
  font-size: ${pxToRem(16)};
  font-family: "lato", sans-serif;
  font-weight: 400;
  text-decoration: underline;
  color: #10375c;
  cursor: pointer;
`;
