import { useMutation, useQueryClient } from "@tanstack/react-query"
import { type LoginFormData, type RegisterFormData } from "@/schemas/auth.schema"
import { authLogin, authRegister } from "@/services/auth.service"

interface UseAuthProps {
  onSuccess?: (data: ReturnType<typeof authRegister>) => void
  onError?: (error: unknown) => void
}
export const useAuth = ({ onSuccess, onError }: UseAuthProps) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: RegisterFormData) => authRegister(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["auth"] })
      if (onSuccess) onSuccess(data)
    },
    onError: (error) => {
      console.error("[useAuth]: Error in mutation:", error)
      if (onError) onError(error)
    }
  })
}

interface UseAuthLoginProps {
  onSuccess?: (data: ReturnType<typeof authLogin>) => void
  onError?: (error: unknown) => void
}
export const useAuthLogin = ({ onSuccess, onError }: UseAuthLoginProps) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: LoginFormData) => authLogin(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["authLogin"] })
      if (onSuccess) onSuccess(data)
    },
    onError: (error) => {
      console.error("[useAuthLogin]: Error in mutation:", error)
      if (onError) onError(error)
    }
  })
}