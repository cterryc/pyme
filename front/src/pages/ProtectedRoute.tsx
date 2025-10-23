import { Navigate, Outlet } from 'react-router-dom'

export const ProtectedRoute = () => {
  const token = localStorage.getItem('tokenPyme')
  if (!token) {
    return <Navigate to='/inicio-sesion' replace />
  }
  return <Outlet />
}
