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
import { ProtectedAdminRoute } from '@/components/ProtectedAdminRoute'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { PublicRoute } from '@/components/PublicRoute'

export const mainRouter = createBrowserRouter([
  {
    path: '/',
    errorElement: <NotFound />,
    element: <Landing />
  },
  {
    path: '/Registro',
    element: (
      <PublicRoute>
        <Register />
      </PublicRoute>
    )
  },
  {
    path: '/Login',
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    )
  },
  {
    path: '/Dashboard',
    element: (
      <ProtectedRoute>
        <UserDashboard />
      </ProtectedRoute>
    ),
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
      },
    ]
  },
  {
    path: '/admin/*',
    element: (
      <ProtectedAdminRoute>
        <AdminDashboard />
      </ProtectedAdminRoute>
    )
  },
  {
    path: '/Dashboard/RegistroDocumentosPyme/:id',
    element: (
      <ProtectedRoute>
        <RegisterPymeDocuments />
      </ProtectedRoute>
    )
  },
  {
    path: '/Dashboard/RegistroPyme',
    element: (
      <ProtectedRoute>
        <RegisterPyme />
      </ProtectedRoute>
    )
  },
  {
    path: '/Dashboard/SolicitarCredito/:id',
    element: (
      <ProtectedRoute>
        <LoanRequest />
      </ProtectedRoute>
    )
  },
  {
    path: '/Dashboard/SolicitarCredito/Success',
    element: (
      <ProtectedRoute>
        <LoanRequestSuccess />
      </ProtectedRoute>
    )
  },
  {
    // add pages
  }
])
