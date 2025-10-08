import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Sidebar } from '@/components/Sidebar'
import { SearchBar } from '@/components/SearchBar'
import { FilterDropdown } from '@/components/FilterDropdown'
import { DataTable } from '@/components/DataTable'
import { StatusBadge } from '@/components/StatusBadge'
import { useState } from 'react'

// Interfaces para los datos
interface CreditApplication {
  id: string
  empresa: string
  solicitante: string
  fechaSolicitud: string
  monto: number
  estado: 'Pendiente' | 'Aprobado' | 'Rechazado'
  acciones: string
}

// Datos de ejemplo para la tabla de solicitudes (como en la imagen)
const mockCreditApplications: CreditApplication[] = [
  {
    id: '1',
    empresa: 'Empresa ABC',
    solicitante: 'Carlos López',
    fechaSolicitud: '2024-07-06',
    monto: 50000,
    estado: 'Pendiente',
    acciones: 'Ver'
  },
  {
    id: '2',
    empresa: 'Empresa XYZ',
    solicitante: 'Ana García',
    fechaSolicitud: '2024-07-05',
    monto: 75000,
    estado: 'Aprobado',
    acciones: 'Ver'
  },
  {
    id: '3',
    empresa: 'Empresa 123',
    solicitante: 'Pedro Ramírez',
    fechaSolicitud: '2024-07-04',
    monto: 25000,
    estado: 'Rechazado',
    acciones: 'Ver'
  },
  {
    id: '4',
    empresa: 'Empresa DEF',
    solicitante: 'Sofía Martínez',
    fechaSolicitud: '2024-07-03',
    monto: 100000,
    estado: 'Pendiente',
    acciones: 'Ver'
  },
  {
    id: '5',
    empresa: 'Empresa GHI',
    solicitante: 'Javier Torres',
    fechaSolicitud: '2024-07-02',
    monto: 80000,
    estado: 'Aprobado',
    acciones: 'Ver'
  }
]

export const UserDashboard = () => {
  const [activeSection, setActiveSection] = useState('solicitudes')
  const [searchTerm, setSearchTerm] = useState('')
  const [estadoFilter, setEstadoFilter] = useState('Todos')
  const [fechaFilter, setFechaFilter] = useState('Reciente')
  const [montoFilter, setMontoFilter] = useState('Todos')

  // Configuración del sidebar
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'solicitudes', label: 'Solicitudes', icon: '📋' },
    { id: 'clientes', label: 'Clientes', icon: '👥' },
    { id: 'productos', label: 'Productos', icon: '📦' },
    { id: 'configuracion', label: 'Configuración', icon: '⚙️' }
  ]

  // Configuración de columnas para la tabla
  const tableColumns = [
    { key: 'empresa', label: 'EMPRESA', width: '20%' },
    { key: 'solicitante', label: 'SOLICITANTE', width: '20%' },
    { key: 'fechaSolicitud', label: 'FECHA DE SOLICITUD', width: '20%' },
    { key: 'monto', label: 'MONTO', width: '15%' },
    { key: 'estado', label: 'ESTADO', width: '15%' },
    { 
      key: 'acciones', 
      label: 'ACCIONES', 
      width: '10%',
      render: () => (
        <button className="text-blue-600 hover:text-blue-800 font-medium">
          Ver
        </button>
      )
    }
  ]

  // Filtrar datos según los filtros aplicados
  const filteredData = mockCreditApplications.filter(app => {
    const matchesSearch = app.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.solicitante.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesEstado = estadoFilter === 'Todos' || app.estado === estadoFilter
    return matchesSearch && matchesEstado
  })

  const renderSolicitudesContent = () => (
    <div className="flex-1 bg-white">
      {/* Header del contenido */}
      <div className="px-8 py-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Solicitudes de Crédito</h1>
        <p className="text-gray-600 text-sm mt-1">Gestiona y revisa las solicitudes de crédito de las PYMES</p>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="px-8 py-6 border-b border-gray-200">
        <div className="flex flex-wrap items-center gap-4">
          <SearchBar
            placeholder="Buscar por nombre de empresa"
            value={searchTerm}
            onChange={setSearchTerm}
          />
          
          <div className="flex items-center gap-4">
            <FilterDropdown
              value={estadoFilter}
              options={['Todos', 'Pendiente', 'Aprobado', 'Rechazado']}
              onChange={setEstadoFilter}
            />
            
            <FilterDropdown
              value={fechaFilter}
              options={['Reciente', 'Antigua', 'Esta semana', 'Este mes']}
              onChange={setFechaFilter}
            />
            
            <FilterDropdown
              value={montoFilter}
              options={['Todos', 'Menor a $50K', '$50K - $100K', 'Mayor a $100K']}
              onChange={setMontoFilter}
            />
          </div>
        </div>
      </div>

      {/* Tabla de datos */}
      <div className="px-8 py-6">
        <DataTable
          columns={tableColumns}
          data={filteredData}
          onRowClick={(row) => console.log('Clicked row:', row)}
        />
      </div>
    </div>
  )

  const renderDashboardContent = () => (
    <div className="flex-1 bg-white p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">📋</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Solicitudes</p>
              <p className="text-2xl font-bold text-gray-900">{mockCreditApplications.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">✅</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Aprobadas</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockCreditApplications.filter(app => app.estado === 'Aprobado').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">⏳</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockCreditApplications.filter(app => app.estado === 'Pendiente').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">❌</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rechazadas</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockCreditApplications.filter(app => app.estado === 'Rechazado').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Solicitudes recientes */}
      <div className="bg-white rounded-lg shadow border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Solicitudes Recientes</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {mockCreditApplications.slice(0, 3).map((app) => (
              <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{app.empresa}</p>
                  <p className="text-sm text-gray-600">{app.solicitante}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(app.monto)}
                  </p>
                  <StatusBadge status={app.estado} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case 'solicitudes':
        return renderSolicitudesContent()
      case 'dashboard':
        return renderDashboardContent()
      case 'clientes':
        return (
          <div className="flex-1 bg-white p-8">
            <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
            <p className="text-gray-600 mt-2">Gestión de clientes - En desarrollo</p>
          </div>
        )
      case 'productos':
        return (
          <div className="flex-1 bg-white p-8">
            <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
            <p className="text-gray-600 mt-2">Gestión de productos financieros - En desarrollo</p>
          </div>
        )
      case 'configuracion':
        return (
          <div className="flex-1 bg-white p-8">
            <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
            <p className="text-gray-600 mt-2">Configuración del sistema - En desarrollo</p>
          </div>
        )
      default:
        return renderDashboardContent()
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header avatar='/assets/defaultAvatar.jpg' />
      
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