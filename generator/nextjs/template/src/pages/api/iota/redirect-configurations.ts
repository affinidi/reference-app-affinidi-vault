import { IotaConfigurationDto } from "@affinidi-tdk/iota-client";
import type { NextApiRequest, NextApiResponse } from "next";
import { listIotaRedirectConfigurations } from "src/lib/clients/iota";
import { ResponseError } from "src/types/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IotaConfigurationDto[] | ResponseError>
) {
  try {
    const configurations = await listIotaRedirectConfigurations();
    res.status(200).json(configurations);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      message: "Unable to get Affinidi Iota Framework configurations",
    });
  }
}
