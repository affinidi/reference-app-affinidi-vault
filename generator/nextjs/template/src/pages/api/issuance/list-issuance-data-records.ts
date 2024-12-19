import { ListIssuanceRecordResponse } from "@affinidi-tdk/credential-issuance-client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "src/lib/auth/next-auth-options";
import { listIssuanceDataRecords } from "src/lib/clients/credential-issuance";
import { ResponseError } from "src/types/types";

// NOTE: This endpoint is for demo purposes and most likely not required,
// as you should already know your configuration id beforehand.

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ListIssuanceRecordResponse | ResponseError>
) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      res.status(401).json({ message: "You must be logged in." });
      return;
    }
    const { issuanceConfigurationId, exclusiveStartKey } = req.query;
    const flowDataList = await listIssuanceDataRecords(
      issuanceConfigurationId as string,
      exclusiveStartKey ? (exclusiveStartKey as string) : undefined
    );

    res.status(200).json(flowDataList);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Unable to get issuance configurations\n${error}` });
    console.log(error);
  }
}
