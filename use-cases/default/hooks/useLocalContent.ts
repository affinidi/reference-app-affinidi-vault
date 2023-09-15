import { useAuthentication } from "./auth/useAuthentication";

export const useLocalContent = () => {
  const { isAuthenticated, user } = useAuthentication();

  return {
    country: isAuthenticated && user?.country,
  };
};
