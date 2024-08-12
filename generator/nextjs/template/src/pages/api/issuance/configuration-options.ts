import type { NextApiRequest, NextApiResponse } from "next";
import { SelectOption } from "src/components/core/Select";
import { listIssuanceConfigurations } from "src/lib/clients/credential-issuance";
import { ResponseError } from "src/types/types";

// NOTE: This endpoint is for demo purposes and most likely not required,
// as you should already know your configuration id beforehand.

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SelectOption[] | ResponseError>,
) {
  try {
    const configurations = await listIssuanceConfigurations();
    const configurationOptions = configurations.map((configuration) => ({
      label: configuration.name,
      value: configuration.id,
    }));

    res.status(200).json(configurationOptions);
  } catch (error: any) {
    res.status(500).json({ message: "Unable to get issuance configurations" });
    console.log(error);
  }
}
