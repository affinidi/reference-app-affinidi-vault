import { IotaRequest, IotaResponse, OpenMode } from "@affinidi-tdk/iota-browser";

export type ErrorResponse = {
  code: string;
  message?: string;
  issues?: { message: string }[];
};

export type UserInfo = {
  email?: string;
  familyName?: string;
  givenName?: string;
  middleName?: string;
  // picture?: string;
  country?: string;
  nickname?: string;
  // phoneNumber?: string;
  gender?: string;
  birthdate?: string;
  postalCode?: string;
  city?: string;
  address?: string;
  verified?: boolean;
  genre?: string;
  interest?: string;
};

export type ResponseError = {
  message: string;
};

export type IotaRequestRedirectType = {
  configurationId: string
  redirectUrl?: string
};

export type IotaRequestType = {
  configurationId: string
  openMode?: OpenMode
};

export type IotaDataRequest = {
  request: IotaRequest;
  response?: IotaResponse;
};

export type OfferPayload = {
  credentialOfferUri: string;
  expiresIn: number;
  issuanceId: string;
  txCode?: string;
};