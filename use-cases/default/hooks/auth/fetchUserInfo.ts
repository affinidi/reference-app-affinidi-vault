import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import { hostUrl } from "utils/env_public";
import { ErrorResponse } from "types/error";
import { UserInfo } from "types";

export const useFetchUserInfoQuery = () => {
  return useQuery<any, ErrorResponse, { userId: string; user?: UserInfo }>(
    ["userInfo"],
    async (data) => {
      return (
        await axios<any>(`${hostUrl}/api/auth/get-user-info`, {
          method: "GET",
          data,
        })
      ).data;
    },
    { retry: false }
  );
};
