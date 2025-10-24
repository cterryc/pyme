import { apiRequest } from "@/lib/apiRequest";
import type { ApiResponse } from "@/types/ApiResponse";

export const systemService = {
    async getConfig(): Promise<ApiResponse<{ maintenanceMode: boolean }>> {
        return apiRequest<{ maintenanceMode: boolean }>('/system/config', 'GET');
    }
};