import { createBrowserRouter } from 'react-router-dom'
import { Landing } from '../pages/Landing'
import { Register } from '../pages/Register'
import { NotFound } from '../pages/NotFound'
import { Login } from '@/pages/Login'
import { UserDashboard } from '@/pages/UserDashboard'
import { RegisterPyme } from '@/pages/RegisterPyme'
import { RegisterPymeDocuments } from '@/pages/RegisterPymeDocuments'

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
    path: '/Dashboard',
    element: <UserDashboard />
  },
  {
    path: '/Dashboard/RegistroPyme',
    element: <RegisterPyme />
  },
  {
    path: '/Dashboard/RegistroDocumentosPyme',
    element: <RegisterPymeDocuments />
  }

  // add pages
])
