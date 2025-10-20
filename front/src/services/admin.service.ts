import type {
  ListCreditApplicationsParams,
  ListCreditApplicationsResponse,
  CreditApplicationDetailResponse,
  UpdateCreditApplicationStatusRequest,
} from "@/interfaces/admin.interface";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Lista todas las solicitudes de crédito con filtros y paginación
 */
export const listCreditApplications = async (
  params: ListCreditApplicationsParams
): Promise<ListCreditApplicationsResponse> => {
  try {
    const token = localStorage.tokenPyme;
    
    // Construir query params
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
    if (params.status) queryParams.append("status", params.status);
    if (params.companyId) queryParams.append("companyId", params.companyId);
    if (params.applicationNumber) queryParams.append("applicationNumber", params.applicationNumber);
    if (params.minAmount) queryParams.append("minAmount", params.minAmount.toString());
    if (params.maxAmount) queryParams.append("maxAmount", params.maxAmount.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.startDate) queryParams.append("startDate", params.startDate);
    if (params.endDate) queryParams.append("endDate", params.endDate);

    const url = `${API_URL}/admin/applications?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    if (!response.ok) throw result;

    return result;
  } catch (error) {
    console.error("[listCreditApplications]: Error fetching data:", error);
    throw error;
  }
};

/**
 * Obtiene el detalle completo de una solicitud de crédito
 */
export const getCreditApplicationDetail = async (
  id: string
): Promise<CreditApplicationDetailResponse> => {
  try {
    const token = localStorage.tokenPyme;
    console.log('[getCreditApplicationDetail] Fetching:', id);

    const response = await fetch(`${API_URL}/admin/applications/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    console.log('[getCreditApplicationDetail] Response:', result);
    
    if (!response.ok) {
      console.error('[getCreditApplicationDetail] Error response:', result);
      throw result;
    }

    return result;
  } catch (error) {
    console.error("[getCreditApplicationDetail]: Error fetching data:", error);
    throw error;
  }
};

/**
 * Actualiza el estado de una solicitud de crédito
 */
export const updateCreditApplicationStatus = async (
  id: string,
  data: UpdateCreditApplicationStatusRequest
): Promise<CreditApplicationDetailResponse> => {
  try {
    const token = localStorage.tokenPyme;

    const response = await fetch(`${API_URL}/admin/applications/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) throw result;

    return result;
  } catch (error) {
    console.error("[updateCreditApplicationStatus]: Error updating status:", error);
    throw error;
  }
};
