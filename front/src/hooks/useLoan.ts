import type { ListCreditApplicationsResponse, LoanCreditRequestResponse } from "@/interfaces/loan.interface"
import { getCreditApplicationById, getListCreditApplicationsByUser } from "@/services/loan.service"
import { useQuery } from "@tanstack/react-query"

export const useGetListCreditApplicationsByUser = () => {
  return useQuery<ListCreditApplicationsResponse>({
    queryKey: ['loansByUser'], // clave única para cache
    queryFn: () => getListCreditApplicationsByUser(), // función que trae los datos
    staleTime: 1000 * 60 * 5, // 5 min antes de recargar
    retry: 1, // reintenta 1 vez si falla
    refetchOnWindowFocus: false // no recarga al volver a la pestaña
  })
}

export const useGetCreditApplicationById = (id: string) => {
  return useQuery<LoanCreditRequestResponse>({
    queryKey: ['creditById', id],
    queryFn: () => getCreditApplicationById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false
  })
}