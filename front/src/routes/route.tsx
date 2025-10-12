import { createBrowserRouter } from 'react-router-dom'
import { Landing } from '../pages/Landing'
import { Register } from '../pages/Register'
import { NotFound } from '../pages/NotFound'
import { Login } from '@/pages/Login'
import { AdminDashboard } from '@/pages/AdminDashboard'
import { RegisterPyme } from '@/pages/RegisterPyme'

export const mainRouter = createBrowserRouter([
  {
    path: '/',
    errorElement: <NotFound />,
    element: <Landing />
  },
  {
    path: '/Registro',
    element: <Register />
  },
  {
    path: '/Login',
    element: <Login />
  },
  {
    path: '/Dashboard/RegistroPyme',
    element: <RegisterPyme />
  },
  {
    path: '/AdminDashboard',
    element: <AdminDashboard />
  },

  // add pages
])
