import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  ListCreditApplicationsParams,
  ListCreditApplicationsResponse,
  CreditApplicationDetailResponse,
  UpdateCreditApplicationStatusRequest,
} from "@/interfaces/admin.interface";
import {
  listCreditApplications,
  getCreditApplicationDetail,
  updateCreditApplicationStatus,
} from "@/services/admin.service";

/**
 * Hook para listar solicitudes de crédito con filtros
 */
export const useListCreditApplications = (params: ListCreditApplicationsParams) => {
  return useQuery<ListCreditApplicationsResponse>({
    queryKey: ["adminCreditApplications", params],
    queryFn: () => listCreditApplications(params),
    staleTime: 1000 * 60 * 2, // 2 minutos
    retry: 1,
  });
};

/**
 * Hook para obtener el detalle de una solicitud de crédito
 */
export const useGetCreditApplicationDetail = (id: string | null) => {
  return useQuery<CreditApplicationDetailResponse>({
    queryKey: ["adminCreditApplicationDetail", id],
    queryFn: () => getCreditApplicationDetail(id!),
    enabled: !!id, // Solo ejecutar si hay un ID
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 1,
  });
};

interface UseUpdateStatusProps {
  onSuccess?: (data: CreditApplicationDetailResponse) => void;
  onError?: (error: any) => void;
}

/**
 * Hook para actualizar el estado de una solicitud de crédito
 */
export const useUpdateCreditApplicationStatus = ({
  onSuccess,
  onError,
}: UseUpdateStatusProps = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateCreditApplicationStatusRequest;
    }) => updateCreditApplicationStatus(id, data),
    onSuccess: (data) => {
      // Invalidar queries para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ["adminCreditApplications"] });
      queryClient.invalidateQueries({
        queryKey: ["adminCreditApplicationDetail", data.payload.id],
      });
      
      if (onSuccess) onSuccess(data);
    },
    onError: (error) => {
      if (onError) onError(error);
    },
  });
};
