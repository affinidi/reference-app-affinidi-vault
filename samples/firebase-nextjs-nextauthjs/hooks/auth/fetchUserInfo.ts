import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { hostUrl } from 'utils/env_public'
import { ErrorResponse } from 'types/error'

export const useFetchUserInfoQuery = () => {
  return useQuery<any, ErrorResponse, { userId: string; email?: string; did?: string }>(
    ['userInfo'],
    async (data) => {
      return (await axios<any>(
        `${hostUrl}/api/auth/get-user-info`,
        { method: 'GET', data }
      )).data
    },
    { retry: false }
  )
}
