import styled from "styled-components";

import { pxToRem } from "src/styles/px-to-rem";

import Box from "src/components/Box/Box";

export const BannerContainer = styled(Box)`
  position: relative;
  width: 100%;
`;

export const Banner = styled(Box)`
  width: 100%;
  height: 64px;
  margin: ${pxToRem(15)} ${pxToRem(2)} ${pxToRem(18)} 0;
  padding-right: ${pxToRem(24)};
  padding-left: ${pxToRem(24)};
  border-radius: 8px;
  background-color: #e8eeff;
  justify-content: space-between;
  text-align: center;
  align-items: center;
  position: relative;
`;

export const BannerTitle = styled.div`
  font-family: "lato";
  font-weight: bold;
  color: #10375c;
  margin-right: ${pxToRem(8)};
  margin-left: ${pxToRem(15)};
`;

export const BackButton = styled(Box)`
  img {
    height: 20px;
  }
`;

export const CloseButton = styled(Box)`
  cursor: pointer;

  img {
    height: 12px;
  }
`;
