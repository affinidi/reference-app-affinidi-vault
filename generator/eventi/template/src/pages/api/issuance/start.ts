import {
  Configuration,
  IssuanceApi,
  StartIssuanceInput,
  StartIssuanceInputClaimModeEnum,
  StartIssuanceResponse,
} from "@affinidi-tdk/credential-issuance-client";
import type { NextApiRequest, NextApiResponse } from "next";
import { ResponseError } from "src/types/types";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "src/lib/auth/auth-options";
import { getAuthProvider } from "src/lib/clients/auth-provider";
import { projectId } from "src/lib/secrets";

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

    // Issue Event Ticket VC using Affinidi TDK

    // NOTE: With TX_CODE claim mode the holder's DID is optional,
    // so Affinidi Login is not strictly required.
    // However, we highly recommend to add auth to this issuance endpoint.

    //Add VC Issuance Logic here


  } catch (error: any) {
    res.status(500).json({ message: "Unable to start issuance" });
    console.log(error);
  }
}
