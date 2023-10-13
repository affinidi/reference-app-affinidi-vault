import React from 'react'
import styled, { css } from 'styled-components'

import { pxToRem } from 'utils'

type StyledProps = {
  $wrap: React.CSSProperties['flexWrap']
  $direction: React.CSSProperties['flexDirection']
  $justifyContent: React.CSSProperties['justifyContent']
  $alignItems: React.CSSProperties['alignItems']
  $flex: number
  $gap: number
}

// eslint-disable-next-line import/prefer-default-export
export const Box = styled.div<StyledProps>`
  display: flex;
  flex-wrap: ${(props) => props.$wrap};
  align-items: ${(props) => props.$alignItems};
  flex-direction: ${(props) => props.$direction};
  justify-content: ${(props) => props.$justifyContent};

  ${(props) =>
    !!props.$flex &&
    css`
      flex: ${props.$flex};
    `}

  ${(props) =>
    !!props.$gap &&
    css`
      gap: ${pxToRem(props.$gap)};
    `}
`
