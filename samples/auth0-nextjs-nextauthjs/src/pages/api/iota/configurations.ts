import { IotaConfigurationDto } from "@affinidi-tdk/iota-client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "src/lib/auth/next-auth-options";
import { listIotaConfigurations } from "src/lib/clients/iota";
import { ResponseError } from "src/types/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IotaConfigurationDto[] | ResponseError>
) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      res.status(401).json({ message: "You must be logged in." });
      return;
    }

    const configurations = await listIotaConfigurations();
    res.status(200).json(configurations);
  } catch (error: any) {
    res.status(500).json({ message: "Unable to get iota configurations" });
    console.log(error);
  }
}
