import { IotaCredentials, IotaUtils } from "@affinidi-tdk/iota-utils";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "src/lib/auth/next-auth-options";
import { getAuthProvider } from "src/lib/clients/auth-provider";
import { ResponseError } from "src/types/types";

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
    const { iotaConfigurationId } = req.query;
    const authProvider = getAuthProvider();
    const iotaToken = authProvider.createIotaToken(
      iotaConfigurationId as string,
      session.userId,
    );
    const iotaCredentials = await IotaUtils.limitedTokenToIotaCredentials(
      iotaToken.iotaJwt,
    );

    res.status(200).json(iotaCredentials);
  } catch (error: any) {
    res.status(500).json({ message: "Unable to get Iota credentials" });
    console.log(error);
  }
}
