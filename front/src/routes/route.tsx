import { createBrowserRouter } from 'react-router-dom'
import { Landing } from '../pages/Landing'
import { Register } from '../pages/Register'
import { NotFound } from '../pages/NotFound'
import { Login } from '@/pages/Login'
import { AdminDashboard } from '@/pages/AdminDashboard'
import { RegisterPyme } from '@/pages/RegisterPyme'
import { RegisterPymeDocuments } from '@/pages/RegisterPymeDocuments'
import { UserPymesList } from '@/components/UserPymesList'
import { UserProfile } from '@/components/UserProfile'
import { UserCreditRequests } from '@/components/UserCreditRequests'
import { UserDashboard } from '@/pages/UserDashboard'
import { LoanRequest } from '@/pages/LoanRequest'
import { LoanRequestSuccess } from '@/pages/LoanRequestSuccess'
import { ProtectedRoute } from '@/pages/ProtectedRoute'
import { ResetPasword } from '@/pages/ResetPassword'

export const mainRouter = createBrowserRouter([
  {
    path: '/',
    errorElement: <NotFound />,
    element: <Landing />
  },
  {
    path: '/registro',
    element: <Register />
  },
  {
    path: '/inicio-sesion',
    element: <Login />
  },
  {
    path: '/reset-password',
    element: <ResetPasword />
  },

  {
    path: '/panel',
    element: <UserDashboard />,
    children: [
      {
        path: '/panel',
        element: <UserDashboard />,
        children: [
          {
            index: true,
            element: <UserPymesList />
          },
          {
            path: 'solicitudes',
            element: <UserCreditRequests />
          }
          // {
          //   path: 'perfil',
          //   element: <UserProfile />
          // }
        ]
      },
      {
        path: '/admin/*',
        element: <AdminDashboard />
      },
      {
        path: '/panel/registro-documentos/:id',
        element: <RegisterPymeDocuments />
      },
      {
        path: '/panel/registro-pyme',
        element: <RegisterPyme />
      },
      {
        path: '/panel/solicitar-credito/:id',
        element: <LoanRequest />
      },
      {
        path: '/panel/solicitar-credito/hecho',
        element: <LoanRequestSuccess />
      }
    ]
  },

  {
    // add pages
  }
])
