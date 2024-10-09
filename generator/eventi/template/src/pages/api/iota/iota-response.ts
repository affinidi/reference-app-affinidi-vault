import type { NextApiRequest, NextApiResponse } from "next";
import {
  Configuration,
  IotaApi,
  FetchIOTAVPResponseOK,
} from "@affinidi-tdk/iota-client";
import { getAuthProvider } from "src/lib/clients/auth-provider";
import { ResponseError } from "src/types/types";
import { z } from "zod";

const responseSchema = z.object({
  configurationId: z.string(),
  correlationId: z.string(),
  transactionId: z.string(),
  responseCode: z.string(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any | ResponseError>
) {
  try {

    //Get the Requested data for initiated request using Affinidi Iota

    

  } catch (error: any) {
    console.log(error);
    const statusCode = error?.httpStatusCode || error.statusCode || 500;
    res
      .status(statusCode)
      .json({ message: error.message, details: error?.details });
  }
}
