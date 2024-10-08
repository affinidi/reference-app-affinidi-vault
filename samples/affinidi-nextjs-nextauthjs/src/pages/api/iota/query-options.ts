import type { NextApiRequest, NextApiResponse } from "next";
import { SelectOption } from "src/components/core/Select";
import { listPexQueriesByConfigurationId } from "src/lib/clients/iota";
import { ResponseError } from "src/types/types";

// NOTE: This endpoint is for demo purposes and most likely not required,
// as you should already know your query id beforehand.

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SelectOption[] | ResponseError>,
) {
  try {
    const { iotaConfigurationId } = req.query;

    const configurationQueries = await listPexQueriesByConfigurationId(
      iotaConfigurationId as string,
    );
    const queryOptions = configurationQueries.map((query) => ({
      label: query.name,
      value: query.queryId,
    }));

    res.status(200).json(queryOptions);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: "Unable to fetch queries" });
  }
}
