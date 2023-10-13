import { use } from 'next-api-middleware'
import type { NextApiRequest, NextApiResponse } from 'next'

import { allowedHttpMethods } from '../middlewares/allowed-http-methods'
import { errorHandler } from '../middlewares/error-handler'
import { authenticate } from '../helpers/authenticate'

type HandlerResponse = {
  userId: string
  email?: string
  did?: string
}

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HandlerResponse>
) {
  const { userId, email, did } = await authenticate(req, res)
  res.status(200).json({ userId, email, did })
}

export default use(allowedHttpMethods('GET'), errorHandler)(handler)
