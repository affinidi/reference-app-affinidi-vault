import React, { HTMLAttributes } from 'react'

import * as S from './Box.styled'

export interface BoxProps extends HTMLAttributes<HTMLDivElement> {
  wrap?: React.CSSProperties['flexWrap']
  direction?: React.CSSProperties['flexDirection']
  justifyContent?: React.CSSProperties['justifyContent']
  alignItems?: React.CSSProperties['alignItems']
  flex?: number
  gap?: number
  children: React.ReactNode
}

const Box: React.FC<BoxProps> = ({
  wrap = 'nowrap',
  direction = 'column',
  justifyContent = 'flex-start',
  alignItems = 'normal',
  gap = 0,
  flex = 0,
  ...props
}) => (
  <S.Box
    $wrap={wrap}
    $direction={direction}
    $justifyContent={justifyContent}
    $alignItems={alignItems}
    $gap={gap}
    $flex={flex}
    {...props}
  />
)

export default Box
