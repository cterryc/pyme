import { createBrowserRouter } from 'react-router-dom'
import { Landing } from '../pages/Landing'
import { Register } from '../pages/Register'
import { NotFound } from '../pages/NotFound'
import { Login } from '@/pages/Login'
import { UserDashboard } from '@/pages/UserDashboard'
import { RegisterPyme } from '@/pages/RegisterPyme'
import { RegisterPymeDocuments } from '@/pages/RegisterPymeDocuments'
import { UserPymesList } from '@/components/UserPymesList'
import { UserProfile } from '@/components/UserProfile'
import { UserCreditRequests } from '@/components/UserCreditRequests'

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
    element: <UserDashboard />,
    children: [
       {
        index: true,
        element: <UserProfile />,
      },
      {
        path: 'Pymes',
        element: <UserPymesList />,
      },
      {
        path: 'Solicitudes',
        element: <UserCreditRequests />,
      }
    ]
  },
  {
    path: '/Dashboard/RegistroPyme',
    element: <RegisterPyme />
  },
  {
    path: '/Dashboard/RegistroDocumentosPyme/:id',
    element: <RegisterPymeDocuments />
  }

  // add pages
])
