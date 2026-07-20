import { IotaCredentials, Iota } from "@affinidi-tdk/iota-core";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "src/lib/auth/next-auth-options";
import { getAuthProvider } from "src/lib/clients/auth-provider";
import { ResponseError } from "src/types/types";
import { z } from "zod";

const iotaStartSchema = z.object({
  iotaConfigurationId: z.string(),
  did: z.string().optional(),
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
    const { iotaConfigurationId, did } = iotaStartSchema.parse(req.query);

    // The auth gate above satisfies the websocket security requirement (Affinidi
    // Login or Auth0). The holder DID is optional: prefer an explicit DID, fall
    // back to the logged-in Affinidi DID, else empty (no `aud` set — the Vault
    // then accepts the request without matching a wallet DID).
    const holderDid = did || session.userId || "";

    const authProvider = getAuthProvider();
    const iotaToken = authProvider.createIotaToken(
      iotaConfigurationId,
      holderDid,
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
