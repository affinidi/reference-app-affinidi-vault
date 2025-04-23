import {
  StartIssuanceInput,
  StartIssuanceInputClaimModeEnum,
  StartIssuanceInputDataInnerStatusListDetailsInnerPurposeEnum,
  StartIssuanceInputDataInnerStatusListDetailsInnerStandardEnum,
  StartIssuanceResponse,
} from "@affinidi-tdk/credential-issuance-client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "src/lib/auth/next-auth-options";
import { startIssuance } from "src/lib/clients/credential-issuance";
import { ResponseError } from "src/types/types";
import { z } from "zod";

export const StatusListDetailsInnerSchema = z.object({
  purpose: z.nativeEnum(
    StartIssuanceInputDataInnerStatusListDetailsInnerPurposeEnum
  ),
  standard: z.nativeEnum(
    StartIssuanceInputDataInnerStatusListDetailsInnerStandardEnum
  ),
});

export const MetaDataSchema = z.object({
  expirationDate: z.string().datetime({ offset: true }),
});

export const StartIssuanceInputDataInnerSchema = z.object({
  credentialTypeId: z.string(),
  credentialData: z.record(z.any()),
  statusListDetails: z.array(StatusListDetailsInnerSchema).optional(),
  metaData: MetaDataSchema.optional(),
});

const issuanceStartSchema = z.object({
  claimMode: z.nativeEnum(StartIssuanceInputClaimModeEnum),
  holderDid: z.string().optional(),
  credentials: z.array(StartIssuanceInputDataInnerSchema),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StartIssuanceResponse | ResponseError>
) {
  try {
    // NOTE: With TX_CODE claim mode the holder's DID is optional,
    // so Affinidi Login is not strictly required.
    // However, we highly recommend to add auth to this issuance endpoint.
    //
    const { claimMode, holderDid, credentials } = issuanceStartSchema.parse(
      req.body
    );

    if (
      !holderDid &&
      claimMode == StartIssuanceInputClaimModeEnum.FixedHolder
    ) {
      res.status(400).json({
        message: "Holder DID is required in FIXED_DID claim mode",
      });
      return;
    }
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      res.status(401).json({ message: "You must be logged in." });
      return;
    }

    const apiData: StartIssuanceInput = {
      claimMode,
      ...(holderDid && { holderDid }),
      data: credentials,
    };

    const issuanceResult = await startIssuance(apiData);
    res.status(200).json(issuanceResult);
  } catch (error: any) {
    res.status(500).json({ message: "Unable to start issuance" });
    console.log(error);
  }
}
