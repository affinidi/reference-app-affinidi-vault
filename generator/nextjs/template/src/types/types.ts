import { AlertColor } from "@mui/material";

export type ResponseError = {
  message: string;
};

export type UserInfo = {
  email?: string;
  country?: string;
};

export type ToastProps = {
  message: string | boolean;
  type?: AlertColor;
};
