import {
  StartIssuanceInput,
  StartIssuanceInputClaimModeEnum,
  StartIssuanceResponse,
} from "@affinidi-tdk/credential-issuance-client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "src/lib/auth/next-auth-options";
import { startIssuance } from "src/lib/clients/credential-issuance";
import { ResponseError } from "src/types/types";
import { z } from "zod";

const issuanceStartSchema = z
  .object({
    credentialTypeId: z.string(),
    credentialData: z.any(),
    claimMode: z.nativeEnum(StartIssuanceInputClaimModeEnum),
  })
  .strict();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StartIssuanceResponse | ResponseError>,
) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      res.status(401).json({ message: "You must be logged in." });
      return;
    }
    const { credentialTypeId, credentialData, claimMode } =
      issuanceStartSchema.parse(req.body);

    const apiData: StartIssuanceInput = {
      claimMode,
      holderDid: session.userId,
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
