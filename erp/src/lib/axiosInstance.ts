import axios from 'axios';

const NAME_TOKEN = 'token';

export const axiosInstance = axios.create({
  baseURL: String(import.meta.env.VITE_API_URL),
  headers: {
    Accept: 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem(NAME_TOKEN);
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;

