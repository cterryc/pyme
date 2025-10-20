import { Navigate } from 'react-router-dom';
import { decodeToken } from '@/helpers/decodeToken';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

export function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const token = localStorage.getItem('tokenPyme');
  
  if (!token) {
    // Si no hay token, redirigir al login
    return <Navigate to="/Login" replace />;
  }

  const decoded = decodeToken(token);
  
  if (!decoded) {
    // Si el token es inválido, redirigir al login
    localStorage.removeItem('tokenPyme');
    localStorage.removeItem('userRole');
    return <Navigate to="/Login" replace />;
  }

  if (decoded.role !== 'Admin') {
    // Si no es admin, redirigir al dashboard normal
    return <Navigate to="/Dashboard" replace />;
  }

  // Si es admin, mostrar el contenido
  return <>{children}</>;
}
