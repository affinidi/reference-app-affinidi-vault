import { AlertColor } from "@mui/material"

export type ErrorResponse = {
  code: string
  message?: string
  issues?: { message: string }[]
}

export type ToastProps = {
  message: string | boolean
  type?: AlertColor
}