import styled from "styled-components";

import { pxToRem } from "src/styles/px-to-rem";
import Box from "../Box/Box";

export const Container = styled(Box)`
  padding: ${pxToRem(28)} ${pxToRem(16)};
  height: ${pxToRem(32)};

  @media (min-width: 1024px) {
    padding: ${pxToRem(28)} ${pxToRem(80)};
    height: ${pxToRem(72)};
  }
`;

export const NavigationContainer = styled<any>(Box)`
  color: ${(props) => (props.$isLocal ? `#090c11` : `#222831`)};

  @media (min-width: 1024px) {
    padding: ${pxToRem(22)} ${pxToRem(100)};
    height: ${pxToRem(72)};
  }
`;

export const Title = styled.div<any>`
  color: ${(props) => (props.$isLocal ? `#292929` : `#10375c`)};
  font-size: ${pxToRem(24)};
  font-family: "Playfair Display";
  font-weight: 700;
  user-select: none;
  cursor: pointer;
`;
export const NavTabs = styled.div`
  margin-right: ${pxToRem(40)};
  font-family: "lato", sans-serif;
  font-weight: 700;
`;

export const Button = styled.button<{ variant: "primary" | "secondary" }>`
  background: #fff;
  padding: 12px 24px;
  color: #ff5722;
  font-family: "lato", sans-serif;
  cursor: pointer;

  button:nth-of-type(1) {
    margin-right: ${pxToRem(12)};
  }

  ${({ variant }) =>
    variant === "primary"
      ? `
      background: #fff;
      color:#ff5722;
    `
      : `
      background: #ff5722;
      color: #fff;
    `}
`;

export const Account = styled(Box)`
  cursor: pointer;
`;

export const Avatar = styled.div<any>`
  width: ${pxToRem(32)};
  height: ${pxToRem(32)};
  background-color: ${(props) => (props.$isLocal ? `#292929` : `#10375c`)};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${pxToRem(16)};
`;

export const Email = styled.div<any>`
  color: #090c11;
  font-size: ${pxToRem(16)};
  font-family: "lato", sans-serif;
  font-weight: 700;
  color: ${(props) => (props.$isLocal ? `#090c11` : `#222831`)};
`;

export const Loading = styled.div<any>`
  color: ${(props) => (props.$isLocal ? `#090c11` : `#222831`)};
  font-size: ${pxToRem(16)};
  font-family: "lato", sans-serif;
  font-weight: 700;
`;
