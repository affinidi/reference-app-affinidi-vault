import styled from "styled-components";
import { pxToRem } from "src/styles/px-to-rem";

import Box from "src/components/Box/Box";

export const TileWrapper = styled<any>(Box)`
  color: ${(props) => (props.$isLocal ? `#292929` : `#10375c`)};

  span {
    width: ${pxToRem(138)};
    margin-top: ${pxToRem(3)};
    border-top: ${(props) =>
      props.$isLocal ? `4px solid #3469fc` : `4px solid #ff5722`};
  }
`;

export const TileContainer = styled(Box)``;

export const TileHeader = styled.div`
  font-family: "lato", sans-serif;
  font-weight: 700;
  font-size: ${pxToRem(32)};
  margin-top: ${pxToRem(65)};
`;
