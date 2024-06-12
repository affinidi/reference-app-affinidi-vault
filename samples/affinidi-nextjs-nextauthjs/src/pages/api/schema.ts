import { StartIssuanceResponse } from "@affinidi-tdk/credential-issuance-client";
import type { NextApiRequest, NextApiResponse } from "next";
import { ResponseError } from "src/types/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StartIssuanceResponse | ResponseError>
) {
  try {
    const { jsonSchemaUrl } = req.query;
    const response = await fetch(jsonSchemaUrl as string, {
      method: "GET",
    });
    const schema = await response.json();
    res.status(200).json(schema);
  } catch (error: any) {
    res.status(404).json({ message: "Schema not found" });
    throw error;
  }
}
