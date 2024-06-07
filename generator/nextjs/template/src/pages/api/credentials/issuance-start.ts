import {
  StartIssuanceInput,
  StartIssuanceInputClaimModeEnum,
  StartIssuanceResponse,
} from "@affinidi-tdk/credential-issuance-client";
import type { NextApiRequest, NextApiResponse } from "next";
import { use } from "next-api-middleware";
import { z } from "zod";
import { allowedHttpMethods } from "../../../lib/middlewares/allowed-http-methods";
import { errorHandler } from "../../../lib/middlewares/error-handler";
import { CredentialsClient } from "../clients/credentials-client";

const issuanceStartSchema = z
  .object({
    credentialTypeId: z.string(),
    holderDid: z.string(),
    credentialData: z.any(),
  })
  .strict();

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StartIssuanceResponse>
) {
  try {
    const { credentialTypeId, credentialData, holderDid } =
      issuanceStartSchema.parse(req.body);
    const apiData: StartIssuanceInput = {
      claimMode: StartIssuanceInputClaimModeEnum.TxCode,
      holderDid,
      data: [
        {
          credentialTypeId,
          credentialData: {
            ...credentialData,
            // Add any additional data here
          },
        },
      ],
    };

    const issuanceResult = await CredentialsClient.IssuanceStart(apiData);

    console.log("issuanceResult post backend call", issuanceResult);

    res.status(200).json(issuanceResult);
  } catch (error: any) {
    {
      response: error.response?.data ?? error;
    }
    ("Issuance failed");

    throw error;
  }
}

export default use(allowedHttpMethods("POST"), errorHandler)(handler);
