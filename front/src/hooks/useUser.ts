import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { decodeToken } from '@/helpers/decodeToken'
import { getUserProfile, updateUserProfile } from '@/services/user.service'
import type { getProfileResponse, UserProfileErrorResponse } from '@/interfaces/user.interface'
import type { UserProfileFormData } from '@/schemas/user.schema'

export const useUserProfile = () => {
  return useQuery<getProfileResponse>({
    queryKey: ['userProfile'],
    queryFn: () => getUserProfile(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false
  })
}

export const useUserAuthenticate = () => {
  const queryClient = useQueryClient()
  const [hasUser, setHasUser] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('tokenPyme')
    const user = decodeToken(token || '')

  if (typeof user === 'string') {
    queryClient.clear()
    setHasUser(false)
  } else {
    setHasUser(!!user.id)
  }
  setIsLoading(false)
  }, [queryClient])

  return { hasUser, isLoading }
}


interface UseUpdateProfile {
  onSuccess?: (data: getProfileResponse) => void
  onError?: (error: unknown) => void
}
export const useUpdateUserProfle = ({ onSuccess, onError }: UseUpdateProfile) => {
  return useMutation<getProfileResponse, UserProfileErrorResponse, UserProfileFormData>({
    mutationFn: async (data) => updateUserProfile(data),
    onSuccess: (data) => {
      if (onSuccess) onSuccess(data)
    },
    onError: (error) => {
      if (onError) onError(error)
    }
  })
}