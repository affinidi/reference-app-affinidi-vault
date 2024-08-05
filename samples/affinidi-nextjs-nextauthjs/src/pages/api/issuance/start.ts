import {
  StartIssuanceInput,
  StartIssuanceInputClaimModeEnum,
  StartIssuanceResponse,
} from "@affinidi-tdk/credential-issuance-client";
import type { NextApiRequest, NextApiResponse } from "next";
import { startIssuance } from "src/lib/clients/credential-issuance";
import { ResponseError } from "src/types/types";
import { z } from "zod";

const issuanceStartSchema = z.object({
  credentialTypeId: z.string(),
  credentialData: z.any(),
  claimMode: z.nativeEnum(StartIssuanceInputClaimModeEnum),
  holderDid: z.string().optional(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StartIssuanceResponse | ResponseError>,
) {
  try {
    const { credentialTypeId, credentialData, claimMode, holderDid } =
      issuanceStartSchema.parse(req.body);

    const apiData: StartIssuanceInput = {
      claimMode,
      ...(holderDid && { holderDid }),
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
    res.status(200).json(issuanceResult);
  } catch (error: any) {
    res.status(500).json({ message: "Unable to start issuance" });
    console.log(error);
  }
}
