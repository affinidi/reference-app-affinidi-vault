import { FlowData } from '@affinidi-tdk/credential-issuance-client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from 'src/lib/auth/next-auth-options';
import { changeCredentialStatus } from 'src/lib/clients/credential-issuance';
import { ResponseError } from 'src/types/types';
import { z } from 'zod';

const changeCredentialStatusSchema = z.object({
  issuanceFlowDataId: z.string(),
  changeReason: z.string(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FlowData | ResponseError>
) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      res.status(401).json({ message: 'You must be logged in.' });
      return;
    }
    const { issuanceConfigurationId } = req.query;
    const { issuanceFlowDataId, changeReason } =
      changeCredentialStatusSchema.parse(JSON.parse(req.body));
    const flowData = await changeCredentialStatus(
      issuanceConfigurationId as string,
      { issuanceFlowDataId, changeReason }
    );

    res.status(200).json(flowData);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Unable to get issuance configurations:\n${error}` });
    console.log(error);
  }
}
