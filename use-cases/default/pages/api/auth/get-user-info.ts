import axios from 'axios'
import { use } from 'next-api-middleware'
import type { NextApiRequest, NextApiResponse } from 'next'

import { allowedHttpMethods } from '../middlewares/allowed-http-methods'
import { errorHandler } from '../middlewares/error-handler'
import { authenticate } from '../helpers/authenticate'
import { UserInfo } from 'types'

type HandlerResponse = {
  userId: string
  user?: UserInfo,
}

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HandlerResponse>
) {
  const { userId, user } = await authenticate(req, res)
  res.status(200).json({ userId, user })
}

export default use(allowedHttpMethods('GET'), errorHandler)(handler)
