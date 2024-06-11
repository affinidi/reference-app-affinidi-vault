import { IotaCredentials, IotaUtils } from "@affinidi-tdk/iota-utils";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authProvider } from "src/lib/api/auth-provider";
import { authOptions } from "src/lib/auth/next-auth-options";
import { iotaConfigurationId } from "src/lib/secrets";
import { ResponseError } from "src/types/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IotaCredentials | ResponseError>
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }
  console.log("did, todo add pass to authProvider", session.userId);
  const iotaToken = authProvider.createIotaToken(iotaConfigurationId);
  const iotaCredentials = await IotaUtils.limitedTokenToIotaCredentials(
    iotaToken.iotaJwt
  );

  res.status(200).json(iotaCredentials);
}
