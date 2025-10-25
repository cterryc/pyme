// create api service use axios
import { axiosInstance } from './axiosInstance';
import type { ApiResponse } from '@/types/ApiResponse';
import { AxiosError, type AxiosRequestConfig, isAxiosError } from 'axios';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export async function apiRequest<T>(
  url: string,
  method: HttpMethod = 'GET',
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  try {
    const axiosConfig: AxiosRequestConfig = {
      method,
      url,
      ...config,
    };
    if (data) {
      axiosConfig.data = data;
      if (data instanceof FormData) {
        axiosConfig.headers = {
          ...axiosConfig.headers,
          'Content-Type': 'multipart/form-data',
        };
      }
    }

    const response = await axiosInstance.request<ApiResponse<T>>(axiosConfig);

    if (response.data.error) {
      throw new Error(response.data.message || 'Error en respuesta de API');
    }

    return response.data;
  } catch (e: unknown) {
    const error = e as Error | AxiosError;
    if (isAxiosError<ApiResponse<T>>(error)) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Error en la comunicación con el servidor';

      // if (error.response?.data?.errors) {
      //   Object.entries(error.response.data.errors).forEach(([key, value]) => {
      //     for (const msg of value) {
      //       toast.error(`Error en ${key}: ${msg}`);
      //     }
      //   });
      // }
      throw new Error(errorMessage);
    }
    throw new Error(error.message || 'Error desconocido');
  }
}
