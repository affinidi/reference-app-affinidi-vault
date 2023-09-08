export type ErrorResponse = {
  code: string
  message?: string
  issues?: { message: string }[]
}
