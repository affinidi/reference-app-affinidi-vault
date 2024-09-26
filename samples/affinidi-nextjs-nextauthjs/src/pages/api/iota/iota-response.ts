import type { NextApiRequest, NextApiResponse } from "next";
import { fetchIotaVpResponse } from "src/lib/clients/iota";
import { ResponseError } from "src/types/types";
import { z } from "zod";

const responseSchema = z.object({
  configurationId: z.string(),
  correlationId: z.string(),
  transactionId: z.string(),
  responseCode: z.string(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any | ResponseError>
) {
  try {
    const { responseCode, configurationId, correlationId, transactionId } = responseSchema.parse(req.body);

    const response = await fetchIotaVpResponse(configurationId, correlationId, transactionId, responseCode);
    res.status(200).json(response);
  } catch (error: any) {
    console.log(error);
    const statusCode = error?.httpStatusCode || error.statusCode || 500
    res.status(statusCode).json({ message: error.message, details: error?.details });
  }
}
