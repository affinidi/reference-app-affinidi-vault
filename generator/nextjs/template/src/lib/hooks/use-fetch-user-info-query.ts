import { useQuery } from "@tanstack/react-query";
import { ResponseError, UserInfo } from "src/types/types";

export const useFetchUserInfoQuery = () => {
  return useQuery<{ userId: string; user?: UserInfo }, ResponseError>(
    ["userInfo"],
    async () => {
      const response = await fetch(`/api/auth/get-user-info`, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Unable to get user info. Are you authenticated?");
      }
      return await response.json();
    },
    { retry: false }
  );
};
