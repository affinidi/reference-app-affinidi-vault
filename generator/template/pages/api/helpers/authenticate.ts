import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { ApiError } from "../api-error";
import { authOptions } from "../auth/[...nextauth]";

import { UserInfo } from "types";

export async function authenticate(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<{ accessToken: string; userId: string; user?: UserInfo }> {
  const session = await getServerSession(req, res, authOptions);
  console.log("session", session);
  const accessToken = session?.accessToken;
  const userId = session?.userId;
  const user = session?.user;

  if (!accessToken || !userId) {
    throw new ApiError({
      code: "NOT_AUTHENTICATED",
      message: "Access token is not present in the cookies",
      httpStatusCode: 401,
    });
  }

  return { accessToken, userId, user };
}
