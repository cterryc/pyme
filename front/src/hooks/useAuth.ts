import { useMutation, useQueryClient } from "@tanstack/react-query"
import { type RegisterFormData } from "@/schemas/auth.schema"
import { authRegister } from "@/services/auth.service"

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