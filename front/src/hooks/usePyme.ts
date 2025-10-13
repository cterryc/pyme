import { useMutation, useQuery } from '@tanstack/react-query'
import {
  type RegisterPymeErrorResponse,
  type RegisterPymeSucessResponse,
  type RegisterPymeDocumentsSuccessResponse,
  type GetPymesByUserResponse,
  type LoanRequestResponse,
  type LoanRequestErrorResponse
} from '@/interfaces/pyme.interface'
import { type RegisterPymeFormData, type LoanRequestFormData } from '@/schemas/pyme.schema'
import { getPymesByUser, pymeLoanRequestOptions, pymeRegister, pymeRegisterDocuments } from '@/services/pyme.service'

interface UsePymeRegisterProps {
  onSuccess?: (data: RegisterPymeSucessResponse) => void
  onError?: (error: RegisterPymeErrorResponse) => void
}

interface UsePymeRegisterDocumentsProps {
  onSuccess?: (data: RegisterPymeDocumentsSuccessResponse) => void
  onError?: (error: RegisterPymeErrorResponse) => void
}

interface UsePymeLoanRequestProps {
  onSuccess?: (data: LoanRequestResponse) => void
  onError?: (error: LoanRequestErrorResponse) => void
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

export const usePymeRegisterDocuments = ({ onSuccess, onError }: UsePymeRegisterDocumentsProps) => {
  // return useMutation<RegisterPymeSucessResponse, RegisterPymeErrorResponse, RegisterPymeDocumentsFormData>({
  return useMutation<RegisterPymeDocumentsSuccessResponse, RegisterPymeErrorResponse, FormData>({
    mutationFn: async (data) => pymeRegisterDocuments(data),
    onSuccess: (data) => {
      if (onSuccess) onSuccess(data)
    },
    onError: (error) => {
      if (onError) onError(error)
    }
  })
}

export const usePymeLoanRequest = ({ onSuccess, onError }: UsePymeLoanRequestProps) => {
  // return useMutation<RegisterPymeSucessResponse, RegisterPymeErrorResponse, RegisterPymeDocumentsFormData>({
  return useMutation<LoanRequestResponse, LoanRequestErrorResponse, LoanRequestFormData>({
    mutationFn: async (data) => pymeLoanRequestOptions(data),
    onSuccess: (data) => {
      if (onSuccess) onSuccess(data)
    },
    onError: (error) => {
      if (onError) onError(error)
    }
  })
}

export const useGetPymesByUser = () => {
  return useQuery<GetPymesByUserResponse>({
    queryKey: ['pymesByUser'], // clave única para cache
    queryFn: () => getPymesByUser(), // función que trae los datos
    staleTime: 1000 * 60 * 5, // 5 min antes de recargar
    retry: 1, // reintenta 1 vez si falla
    refetchOnWindowFocus: false // no recarga al volver a la pestaña
  })
}
