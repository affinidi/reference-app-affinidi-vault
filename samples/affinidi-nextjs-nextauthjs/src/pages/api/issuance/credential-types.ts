import { CredentialSupportedObject } from "@affinidi-tdk/credential-issuance-client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getIssuanceConfigurationById } from "src/lib/clients/credential-issuance";
import { ResponseError } from "src/types/types";

// NOTE: This endpoint is for demo purposes and most likely not required,
// as you should already know your credential configuration id beforehand.

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CredentialSupportedObject[] | ResponseError>,
) {
  try {
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
