export type ErrorResponse = {
  code: string;
  message?: string;
  issues?: { message: string }[];
};

export type UserInfo = {
  email?: string;
  country?: string;
};
