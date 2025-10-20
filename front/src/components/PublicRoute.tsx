import { Navigate } from 'react-router-dom';
import { decodeToken } from '@/helpers/decodeToken';

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * Protege rutas públicas (Login/Register) para que no sean accesibles si ya estás logueado
 */
export function PublicRoute({ children }: PublicRouteProps) {
  const token = localStorage.getItem('tokenPyme');
  
  if (!token) {
    // Si no hay token, permitir acceso a la ruta pública
    return <>{children}</>;
  }

  const decoded = decodeToken(token);
  
  if (!decoded) {
    // Si el token es inválido, limpiar localStorage y permitir acceso
    localStorage.removeItem('tokenPyme');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    return <>{children}</>;
  }

  // Si ya está autenticado, redirigir según el rol
  if (decoded.role === 'Admin') {
    return <Navigate to="/admin/loans" replace />;
  } else {
    return <Navigate to="/Dashboard" replace />;
  }
}
