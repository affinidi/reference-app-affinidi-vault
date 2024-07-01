import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { SelectOption } from "src/components/core/Select";
import { authOptions } from "src/lib/auth/next-auth-options";
import { listPexQueriesByConfigurationId } from "src/lib/clients/iota";
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
    res.status(500).json({ message: "Unable to fetch queries" });
    console.log(error);
  }
}
