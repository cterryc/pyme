import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getUser } from '@/services/user.service'
import { useEffect, useState } from 'react'
import { decodeToken } from '@/helpers/decodeToken'

export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: getUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false
  })
}

export const useUserAuthenticate = () => {
  const queryClient = useQueryClient()
  const [getUser, setGetUser] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('tokenPyme')
    const user = decodeToken(token || '')

    if (!user) queryClient.clear()

    setGetUser(user?.email.split('@')[0] || '')
    setIsLoading(false)
  }, [queryClient])

  return { getUser, isLoading }
}
