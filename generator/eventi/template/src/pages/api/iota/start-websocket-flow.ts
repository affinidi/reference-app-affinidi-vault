import { IotaCredentials, Iota } from "@affinidi-tdk/iota-core";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "src/lib/auth/auth-options";
import { getAuthProvider } from "src/lib/clients/auth-provider";
import { ResponseError } from "src/types/types";
import { z } from "zod";

const iotaStartSchema = z.object({
  iotaConfigurationId: z.string(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IotaCredentials | ResponseError>,
) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      res.status(401).json({ message: "You must be logged in." });
      return;
    }
    const { iotaConfigurationId } = iotaStartSchema.parse(req.query);

    const authProvider = getAuthProvider();
    const iotaToken = authProvider.createIotaToken(
      iotaConfigurationId,
      session.userId,
    );
    const iotaCredentials = await Iota.limitedTokenToIotaCredentials(
      iotaToken.iotaJwt,
    );

    res.status(200).json(iotaCredentials);
  } catch (error: any) {
    res.status(500).json({ message: "Unable to get Iota credentials" });
    console.log(error);
  }
}
