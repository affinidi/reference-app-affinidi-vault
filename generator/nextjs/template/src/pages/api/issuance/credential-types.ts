import { IssuanceConfigDtoCredentialSupportedInner } from "@affinidi-tdk/credential-issuance-client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "src/lib/auth/next-auth-options";
import { getIssuanceConfigurationById } from "src/lib/clients/credential-issuance";
import { ResponseError } from "src/types/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    IssuanceConfigDtoCredentialSupportedInner[] | ResponseError
  >,
) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      res.status(401).json({ message: "You must be logged in." });
      return;
    }
    const { issuanceConfigurationId } = req.query;

    const configurationDetails = await getIssuanceConfigurationById(
      issuanceConfigurationId as string,
    );

    res.status(200).json(configurationDetails.credentialSupported!);
  } catch (error: any) {
    res.status(500).json({ message: "Unable to fetch credential types" });
    console.log(error);
  }
}
