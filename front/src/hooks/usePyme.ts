import { useMutation } from '@tanstack/react-query'
import { type RegisterPymeErrorResponse, type RegisterPymeSucessResponse } from '@/interfaces/pyme.interface'
import { type RegisterPymeFormData, type RegisterPymeDocumentsFormData } from '@/schemas/pyme.schema'
import { pymeRegister, pymeRegisterDocuments } from '@/services/pyme.service'

interface UsePymeRegisterProps {
  onSuccess?: (data: RegisterPymeSucessResponse) => void
  onError?: (error: unknown) => void
}

export const usePymeRegister = ({ onSuccess, onError }: UsePymeRegisterProps) => {
  return useMutation<RegisterPymeSucessResponse, RegisterPymeErrorResponse, RegisterPymeFormData>({
    mutationFn: async (data) => pymeRegister(data),
    onSuccess: (data) => {
      if (onSuccess) onSuccess(data)
    },
    onError: (error) => {
      if (onError) onError(error)
    }
  })
}

export const usePymeRegisterDocuments = ({ onSuccess, onError }: UsePymeRegisterProps) => {
  // return useMutation<RegisterPymeSucessResponse, RegisterPymeErrorResponse, RegisterPymeDocumentsFormData>({
  return useMutation<RegisterPymeSucessResponse, RegisterPymeErrorResponse, FormData>({
    mutationFn: async (data) => pymeRegisterDocuments(data),
    onSuccess: (data) => {
      if (onSuccess) onSuccess(data)
    },
    onError: (error) => {
      if (onError) onError(error)
    }
  })
}
