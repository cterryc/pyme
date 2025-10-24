function apiURL(): string {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (!apiUrl) {
    throw new Error('VITE_API_URL is not defined');
  }
  return apiUrl;
}

export const apiUrl = apiURL();