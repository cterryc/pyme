import { Navigate } from 'react-router-dom';
import { decodeToken } from '@/helpers/decodeToken';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Protege rutas que requieren autenticación (cualquier usuario logueado)
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem('tokenPyme');
  
  if (!token) {
    // Si no hay token, redirigir al login
    return <Navigate to="/Login" replace />;
  }

  const decoded = decodeToken(token);
  
  if (!decoded) {
    // Si el token es inválido, limpiar y redirigir al login
    localStorage.removeItem('tokenPyme');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    return <Navigate to="/Login" replace />;
  }

  // Si está autenticado correctamente, mostrar el contenido
  return <>{children}</>;
}
