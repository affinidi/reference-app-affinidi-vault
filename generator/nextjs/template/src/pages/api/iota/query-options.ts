import type { NextApiRequest, NextApiResponse } from "next";
import { SelectOption } from "src/components/core/Select";
import {
  listDcqlQueriesByConfigurationId,
  listPexQueriesByConfigurationId,
} from "src/lib/clients/iota";
import { ResponseError } from "src/types/types";

// NOTE: This endpoint is for demo purposes and most likely not required,
// as you should already know your query id beforehand.

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SelectOption[] | ResponseError>,
) {
  try {
    const { iotaConfigurationId } = req.query;
    const configurationId = iotaConfigurationId as string;

    // A configuration can have PEX and/or DCQL queries. DCQL queries only exist
    // for non–Affinidi-Vault configs, and the endpoint may reject DCQL for an
    // Affinidi Vault config, so fetch defensively and fall back to an empty list.
    const [pexQueries, dcqlQueries] = await Promise.all([
      listPexQueriesByConfigurationId(configurationId).catch(() => []),
      listDcqlQueriesByConfigurationId(configurationId).catch(() => []),
    ]);

    const queryOptions = [...pexQueries, ...dcqlQueries].map((query) => ({
      label: query.name,
      value: query.queryId,
    }));

    res.status(200).json(queryOptions);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: "Unable to fetch queries" });
  }
}
