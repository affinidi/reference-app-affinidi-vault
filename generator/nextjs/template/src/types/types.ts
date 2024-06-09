export type ResponseError = {
  message: string;
};

export type UserInfo = {
  email?: string;
  country?: string;
};

export type OfferPayload = {
  credentialOfferUri: string;
  expiresIn: number;
  issuanceId: string;
  txCode: string;
};

export type MessagePayload = {
  message: string;
  type: "success" | "error";
};
