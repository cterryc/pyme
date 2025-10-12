import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Sidebar } from '@/components/Sidebar'
import { DashboardProvider, useDashboard } from '@/context/DashboardContext'
import {
  DashboardOverview,
  SolicitudesContent,
  MypesContent,
  ProductosContent,
  ConfiguracionContent
} from '@/components/dashboard'

const DashboardContent = () => {
  const { activeSection, setActiveSection } = useDashboard()

  // Configuración del sidebar
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'solicitudes', label: 'Solicitudes', icon: '📋' },
    { id: 'clientes', label: 'Pymes', icon: '👥' },
    { id: 'productos', label: 'Productos', icon: '📦' },
    { id: 'configuracion', label: 'Configuración', icon: '⚙️' }
  ]

  const renderContent = () => {
    switch (activeSection) {
      case 'solicitudes':
        return <SolicitudesContent />
      case 'dashboard':
        return <DashboardOverview />
      case 'clientes':
        return <MypesContent />
      case 'productos':
        return <ProductosContent />
      case 'configuracion':
        return <ConfiguracionContent />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      {/* <Header avatar='/assets/defaultAvatar.jpg' /> */}
      
      {/* Layout principal */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          title="Financiera Innova"
          subtitle=""
          items={sidebarItems}
          onItemClick={setActiveSection}
          activeItem={activeSection}
        />

        {/* Contenido principal */}
        {renderContent()}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export const AdminDashboard = () => {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  )
}