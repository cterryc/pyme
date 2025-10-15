import { DashboardProvider } from '@/context/DashboardContext'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ModuleSelectionPage } from './ModuleSelectionPage'
import { SubmoduleSelectionPage } from './SubmoduleSelectionPage'
import { LeftAdminDashboard } from './LeftAdminDashboard'

const AdminDashboardRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ModuleSelectionPage />} />

      <Route path="/modules/:moduleId" element={<SubmoduleSelectionPage />} />
      <Route path="/operations/dashboard" element={<LeftAdminDashboard moduleId="operations" />} />
      <Route path="/operations/solicitudes" element={<LeftAdminDashboard moduleId="operations" />} />
      <Route path="/clients/mypes" element={<LeftAdminDashboard moduleId="clients" />} />
      <Route path="/products/productos" element={<LeftAdminDashboard moduleId="products" />} />
      <Route path="/settings/configuracion" element={<LeftAdminDashboard moduleId="settings" />} />

      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  )
}

export const AdminDashboard = () => {
  return (
    <DashboardProvider>
      <AdminDashboardRoutes />
    </DashboardProvider>
  )
}