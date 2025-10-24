import { apiRequest } from "@/lib/apiRequest";
import type { ApiResponse } from "@/types/ApiResponse";

export const authService = {
    login: async (username: string, password: string): Promise<ApiResponse<{ token: string }>> => {
        return apiRequest<{ token: string }>('/auth/login', 'POST', { username, password });
    },
    validateToken: async (token: string): Promise<ApiResponse<{ valid: boolean }>> => {
        return apiRequest<{ valid: boolean }>('/auth/validate-token', 'POST', { token });
    },
};