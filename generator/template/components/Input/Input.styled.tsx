import styled, { css } from "styled-components";

import { pxToRem } from "utils";
import { Theme } from "utils/theme";

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
    return props.theme.colors.neutral.primary["30"];
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
    return props.theme.colors.neutral.primary["15"];
  }

  return props.theme.colors.brand.primary["90"];
};

export const Icon = styled.div<Props>`
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
`;

export const Input = styled.input<
  Pick<Props, "$hasError"> & { $hasIcon: boolean }
>`
  width: 100%;
  height: ${pxToRem(48)};
  padding: ${pxToRem(16)} ${pxToRem(12)};
  background: ${(props) => props.theme.colors.neutral.secondary["100"]};
  color: ${(props) => props.theme.colors.neutral.primary["90"]};
  font-family: "Nunito Sans", sans-serif;
  font-weight: 500;
  font-size: ${pxToRem(16)};
  border-radius: 4px;
  line-height: ${pxToRem(22)};
  letter-spacing: 0.2px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "text")};
  transition: border-color 0.125s ease-in-out;
  outline: none;
  border: 1px solid ${(props) => props.theme.colors.neutral.primary["15"]};

  ${(props) =>
    props.$hasIcon &&
    css`
      padding-right: ${pxToRem(48)};
    `}
  ${(props) =>
    props.value &&
    css`
      background: ${props.theme.colors.neutral.secondary["100"]};
    `}
  ${(props) =>
    props.$hasError &&
    css`
      color: ${props.theme.colors.utility.danger["100"]};
      padding: ${pxToRem(15)} ${pxToRem(11)};
      border: 2px solid ${props.theme.colors.utility.danger["100"]};
    `}
  ${(props) =>
    !props.$hasError &&
    css`
      &:not([disabled]) {
        &:hover {
          border-color: ${props.theme.colors.brand.primary["90"]};
        }

        &:focus {
          padding: ${pxToRem(15)} ${pxToRem(11)};
          border: 2px solid ${props.theme.colors.brand.primary["90"]};
        }
      }
    `}
  ::placeholder {
    font-weight: 500;
    color: ${(props) => props.theme.colors.neutral.primary["30"]};
  }

  &[disabled] {
    color: ${(props) => props.theme.colors.neutral.primary["30"]};
  }
`;

export const HelpText = styled.div<{
  $hasError?: boolean;
  $disabled?: boolean;
}>`
  color: ${getTextColor};
`;
