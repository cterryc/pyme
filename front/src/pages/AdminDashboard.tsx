import { DashboardProvider } from '@/context/DashboardContext'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ModuleSelectionPage } from './ModuleSelectionPage'
import { SubmoduleSelectionPage } from './SubmoduleSelectionPage'
import { LeftAdminDashboard } from './LeftAdminDashboard'

const AdminDashboardRoutes = () => {
  return (
    <Routes>
      {/* Main module selection page */}
      <Route path='/' element={<ModuleSelectionPage />} />

      {/* Submodule selection for a specific module (optional, can be removed if not needed) */}
      <Route path='/modules/:moduleId' element={<SubmoduleSelectionPage />} />
      {/* All submodule routes now use the same LeftAdminDashboard with collapsible sidebar */}
      <Route path="/operations/dashboard" element={<LeftAdminDashboard />} />
      <Route path="/operations/solicitudes" element={<LeftAdminDashboard />} />
      <Route path="/clients/mypes" element={<LeftAdminDashboard />} />
  {/* Products/Planes removed from admin menu */}
      <Route path="/settings/configuracion" element={<LeftAdminDashboard />} />

      {/* Redirect unknown routes to main page */}
      <Route path='*' element={<Navigate to='/admin' replace />} />
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
