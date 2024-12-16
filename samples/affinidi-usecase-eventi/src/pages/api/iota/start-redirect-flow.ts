import {
  Configuration,
  IotaApi,
  IotaConfigurationDtoModeEnum,
  InitiateDataSharingRequestOKData,
} from "@affinidi-tdk/iota-client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getAuthProvider } from "src/lib/clients/auth-provider";
import { ResponseError } from "src/types/types";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const initShareSchema = z.object({
  configurationId: z.string(),
  queryId: z.string(),
  redirectUri: z.string(),
  nonce: z.string(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any | ResponseError>
) {
  try {
    //Add Affinidi Iota Redirect flow login using Affinidi TDK


  } catch (error: any) {
    res.status(500).json({ message: "Unable to get Iota credentials" });
    console.log(error);
  }
}
