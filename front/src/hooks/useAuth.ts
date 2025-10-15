import { useMutation } from '@tanstack/react-query'
import { type LoginFormData, type RegisterFormData } from '@/schemas/auth.schema'
import { authLogin, authRegister } from '@/services/auth.service'
import { type AuthSucessResponse, type AuthErrorResponse } from '@/interfaces/auth.interface'

interface UseAuthRegisterProps {
  onSuccess?: (data: AuthSucessResponse) => void
  onError?: (error: unknown) => void
}
export const useAuthRegister = ({ onSuccess, onError }: UseAuthRegisterProps) => {
  return useMutation<AuthSucessResponse, AuthErrorResponse, RegisterFormData>({
    mutationFn: async (data) => authRegister(data),
    onSuccess: (data) => {
      if (onSuccess) onSuccess(data)
    },
    onError: (error) => {
      if (onError) onError(error)
    }
  })
}

interface UseAuthLoginProps {
  onSuccess?: (data: AuthSucessResponse) => void
  onError?: (error: unknown) => void
}
export const useAuthLogin = ({ onSuccess, onError }: UseAuthLoginProps) => {
  return useMutation<AuthSucessResponse, AuthErrorResponse, LoginFormData>({
    mutationFn: async (data) => authLogin(data),
    onSuccess: (data) => {
      if (onSuccess) onSuccess(data)
    },
    onError: (error) => {
      if (onError) onError(error)
    }
  })
}
