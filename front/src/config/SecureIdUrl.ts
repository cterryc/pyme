/**
 * Obtiene la URL de firma electrónica desde las variables de entorno
 * @returns La URL configurada para el servicio de firma electrónica
 * @throws Error si la variable de entorno no está definida
 */
export const getSecureIdUrl = (): string => {
  const signUrl = import.meta.env.VITE_SIGN_URL;
  
  if (!signUrl) {
    throw new Error('VITE_SIGN_URL no está definida');
  }
  
  return signUrl;
};

/**
 * Obtiene la URL de firma electrónica de forma segura
 * @returns La URL configurada o una cadena vacía si no está definida
 */
export const getSecureIdUrlSafe = (): string => {
  return import.meta.env.VITE_SIGN_URL || '';
};