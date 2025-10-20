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
    path: '/Registro',
    element: <Register />
  },
  {
    path: '/Login',
    element: <Login />
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/Dashboard',
        element: <UserDashboard />,
        children: [
          {
            index: true,
            element: <UserPymesList />
          },
          {
            path: 'Solicitudes',
            element: <UserCreditRequests />
          },
          {
            path: 'Perfil',
            element: <UserProfile />
          }
        ]
      },
      {
        path: '/admin/*',
        element: <AdminDashboard />
      },
      {
        path: '/Dashboard/RegistroDocumentosPyme/:id',
        element: <RegisterPymeDocuments />
      },
      {
        path: '/Dashboard/RegistroPyme',
        element: <RegisterPyme />
      },
      {
        path: '/Dashboard/SolicitarCredito/:id',
        element: <LoanRequest />
      },
      {
        path: '/Dashboard/SolicitarCredito/Success',
        element: <LoanRequestSuccess />
      },
    ]
  {
    path: '/ResetPassword',
    element: <ResetPasword />
  },
  {
    path: '/Dashboard',
    element: <UserDashboard />,
    children: [
      {
        index: true,
        element: <UserPymesList />
      },
      {
        path: 'Solicitudes',
        element: <UserCreditRequests />
      },
      {
        path: 'Perfil',
        element: <UserProfile />
      }
    ]
  },
  {
    path: '/admin/*',
    element: <AdminDashboard />
  },
  {
    path: '/Dashboard/RegistroDocumentosPyme/:id',
    element: <RegisterPymeDocuments />
  },
  {
    path: '/Dashboard/RegistroPyme',
    element: <RegisterPyme />
  },
  {
    path: '/Dashboard/SolicitarCredito/:id',
    element: <LoanRequest />
  },
  {
    path: '/Dashboard/SolicitarCredito/Success',
    element: <LoanRequestSuccess />
  },
  {
    // add pages
  }
])
