import { useFetchUserInfoQuery } from './fetchUserInfo'

export function useAuthentication() {
  const { data, status } = useFetchUserInfoQuery()

  return {
    isLoading: status === 'loading',
    isAuthenticated: status === 'success',
    email: data?.email,
    userId: data?.userId,
    did: data?.did,
  }
}
