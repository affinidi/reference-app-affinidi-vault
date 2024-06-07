import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "src/lib/auth/next-auth-options";
import { ResponseError, UserInfo } from "src/types/types";

type HandlerResponse = {
  userId: string;
  user?: UserInfo;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HandlerResponse | ResponseError>
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  res.status(200).json({ userId: session.userId, user: session.user });
}
