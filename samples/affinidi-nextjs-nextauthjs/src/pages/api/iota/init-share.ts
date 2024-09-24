import { IotaConfigurationDto } from "@affinidi-tdk/iota-client";
import type { NextApiRequest, NextApiResponse } from "next";
import { initiateDataSharingRequest } from "src/lib/clients/iota";
import { ResponseError } from "src/types/types";
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
    const { configurationId, queryId, redirectUri, nonce } = initShareSchema.parse(req.body);
    const response = await initiateDataSharingRequest(configurationId, queryId, redirectUri, nonce);

    res.status(200).json(response);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}
