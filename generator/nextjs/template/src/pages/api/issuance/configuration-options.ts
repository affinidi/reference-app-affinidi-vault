import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { SelectOption } from "src/components/core/Select";
import { authOptions } from "src/lib/auth/next-auth-options";
import { listIssuanceConfigurations } from "src/lib/clients/credential-issuance";
import { ResponseError } from "src/types/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SelectOption[] | ResponseError>,
) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      res.status(401).json({ message: "You must be logged in." });
      return;
    }

    const configurations = await listIssuanceConfigurations();
    const configurationOptions = configurations.map((configuration) => ({
      label: configuration.name,
      value: configuration.id,
    }));

    res.status(200).json(configurationOptions);
  } catch (error: any) {
    res.status(500).json({ message: "Unable to get issuance configurations" });
    throw error;
  }
}
