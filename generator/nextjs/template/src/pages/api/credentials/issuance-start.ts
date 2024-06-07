import {
  StartIssuanceInput,
  StartIssuanceInputClaimModeEnum,
  StartIssuanceResponse,
} from "@affinidi-tdk/credential-issuance-client";
import type { NextApiRequest, NextApiResponse } from "next";
import { startIssuance } from "src/lib/api/credential-issuance";
import { ResponseError } from "src/types/types";
import { z } from "zod";

const issuanceStartSchema = z
  .object({
    credentialTypeId: z.string(),
    holderDid: z.string(),
    credentialData: z.any(),
  })
  .strict();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StartIssuanceResponse | ResponseError>
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

    const issuanceResult = await startIssuance(apiData);

    console.log("issuanceResult post backend call", issuanceResult);

    res.status(200).json(issuanceResult);
  } catch (error: any) {
    res.status(500).json({ message: "Unable to start issuance" });
    throw error;
  }
}
