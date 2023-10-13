import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { ApiError } from '../api-error'
import { authOptions } from '../auth/[...nextauth]'

export async function authenticate(req: NextApiRequest, res: NextApiResponse): Promise<{ did?: string; accessToken: string; userId: string; email?: string }> {
  const session = await getServerSession(req, res, authOptions)
  const accessToken = session?.accessToken
  const did = session?.did
  const userId = session?.userId
  const email = session?.email

  if (!accessToken || !userId) {
    throw new ApiError({
      code: 'NOT_AUTHENTICATED',
      message: 'Access token is not present in the cookies',
      httpStatusCode: 401,
    })
  }

  return { accessToken, did, userId, email }
}
