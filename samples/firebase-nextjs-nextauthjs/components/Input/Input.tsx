import React, { forwardRef, InputHTMLAttributes } from 'react'

import Box from '../Box/Box'

import * as S from './Input.styled'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string
  icon?: React.ReactElement
  hasError?: boolean
  helpText?: string
  onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ onChange, hasError, helpText, label, icon, className, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(event.target.value, event)
      }
    }

    return (
      <Box direction="column" gap={4} className={className}>
        {label && (
          <S.Label $hasError={hasError} $disabled={props.disabled}>
            {label}
          </S.Label>
        )}

        <S.InputWrapper>
          <S.Input
            onChange={handleChange}
            data-testid="input"
            $hasError={hasError}
            ref={ref}
            $hasIcon={!!icon}
            {...props}
          />

          {icon && (
            <S.Icon $hasError={hasError} $disabled={props.disabled}>
              {icon}
            </S.Icon>
          )}
        </S.InputWrapper>

        {helpText && (
          <S.HelpText $hasError={hasError} $disabled={props.disabled}>
            {helpText}
          </S.HelpText>
        )}
      </Box>
    )
  },
)
Input.displayName = 'Input'

export default Input
