import { Navigate, Outlet } from 'react-router-dom'

export const ProtectedRoute = () => {
  const token = localStorage.getItem('tokenPyme')
  let role = ''
  if (token) {
    role = JSON.parse(atob(token?.split('.')[1])).role
    console.log(role)
    if (role == 'Admin') {
      return <Navigate to='/admin' replace />
    }
  }
  if (!token) {
    return <Navigate to='/inicio-sesion' replace />
  }
  return <Outlet />
}
