import styled, { css } from "styled-components";

import { pxToRem } from "src/styles/px-to-rem";
import { Theme } from "src/styles/theme";

type Props = {
  $hasError?: boolean;
  $disabled?: boolean;
  theme: Theme;
};

const getTextColor = (props: Props) => {
  if (props.$hasError) {
    return props.theme.colors.utility.danger["100"];
  }

  if (props.$disabled) {
    return props.theme.colors.brand.secondary["40"];
  }

  return "";
};

export const Label = styled.div<{
  $hasError?: boolean;
  $disabled?: boolean;
}>`
  color: ${getTextColor};
`;

export const InputWrapper = styled.div`
  position: relative;
`;

const getIconColor = (props: Props) => {
  if (props.$hasError) {
    return props.theme.colors.utility.danger["100"];
  }

  if (props.$disabled) {
    return props.theme.colors.brand.secondary["20"];
  }

  return props.theme.colors.brand.secondary["90"];
};

export const Icon = styled.div<{ $hasError?: boolean; $disabled?: boolean }>`
  position: absolute;
  top: 50%;
  right: ${pxToRem(16)};
  transform: translate(0, -50%);
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  pointer-events: ${(props) => (props.$disabled ? "none" : "unset")};

  svg {
    display: block;
    fill: ${getIconColor};
  }

  path {
    fill: ${getIconColor};
  }
`;

export const Input = styled.input<{ $hasError?: boolean; $hasIcon: boolean }>`
  width: 100%;
  height: ${pxToRem(48)};
  padding: ${pxToRem(14)} ${pxToRem(16)};
  background: ${(props) => props.theme.colors.brand.tertiary["100"]};
  color: ${(props) => props.theme.colors.brand.secondary["90"]};
  font-family: "lato", sans-serif;
  font-weight: 400;
  font-size: ${pxToRem(16)};
  border-radius: 4px;
  line-height: ${pxToRem(20)};
  letter-spacing: 0.2px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "text")};
  transition: border-color 0.125s ease-in-out;
  outline: none;
  border: 1px solid ${(props) => props.theme.colors.brand.secondary["20"]};

  ${(props) =>
    props.$hasIcon &&
    css`
      padding-right: ${pxToRem(48)};
    `}

  ${(props) =>
    props.value &&
    css`
      background: ${props.theme.colors.brand.tertiary["100"]};
    `}

  ${(props) =>
    props.$hasError &&
    css`
      padding: ${pxToRem(15)} ${pxToRem(11)};
      border: 2px solid ${props.theme.colors.utility.danger["100"]};
    `}

  ${(props) =>
    !props.$hasError &&
    css`
      &:not([disabled]) {
        &:hover {
          border-color: ${props.theme.colors.accent.primary["100"]};
        }

        &:focus {
          padding: ${pxToRem(14)} ${pxToRem(16)};
          border: 2px solid ${props.theme.colors.accent.primary["100"]};
        }
      }
    `}
  ::placeholder {
    font-weight: 400;
    color: ${(props) => props.theme.colors.brand.secondary["40"]};
  }

  &[disabled] {
    color: ${(props) => props.theme.colors.brand.secondary["40"]};
  }
`;

export const HelpText = styled.div<{
  $hasError?: boolean;
  $disabled?: boolean;
}>`
  color: ${getTextColor};
`;
