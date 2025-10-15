import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Module } from '@/interfaces/module.interface'
import { 
  FiHome, 
  FiFileText, 
  FiUsers, 
  FiPackage, 
  FiSettings 
} from 'react-icons/fi'

// Interfaces para los datos
export interface CreditApplication {
  id: string
  empresa: string
  solicitante: string
  fechaSolicitud: string
  monto: number
  estado: 'Pendiente' | 'Aprobado' | 'Rechazado'
  acciones: string
}

export interface Client {
  id: string
  nombre: string
  email: string
  telefono: string
  empresa: string
  fechaRegistro: string
  estado: 'Activo' | 'Inactivo'
}

export interface Product {
  id: string
  nombre: string
  tipo: string
  tasaInteres: number
  montoMinimo: number
  montoMaximo: number
  plazoMaximo: number
  estado: 'Activo' | 'Inactivo'
}

// Estado del contexto
interface DashboardContextType {
  // Module management
  modules: Module[]
  getActiveModules: () => Module[]
  getModuleById: (moduleId: string) => Module | undefined
  getSubmoduleByRoute: (route: string) => { module: Module; submodule: any } | undefined
  
  // Sección activa
  activeSection: string
  setActiveSection: (section: string) => void
  
  // Filtros
  searchTerm: string
  setSearchTerm: (term: string) => void
  estadoFilter: string
  setEstadoFilter: (estado: string) => void
  fechaFilter: string
  setFechaFilter: (fecha: string) => void
  montoFilter: string
  setMontoFilter: (monto: string) => void
  
  // Datos
  creditApplications: CreditApplication[]
  clients: Client[]
  products: Product[]
  allSubmodules: any[]
  
  // Funciones utilitarias
  formatCurrency: (amount: number) => string
  formatDate: (dateString: string) => string
  
  // Datos filtrados
  getFilteredApplications: () => CreditApplication[]
  getFilteredClients: () => Client[]
  getFilteredProducts: () => Product[]
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

// Datos de ejemplo
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

const mockClients: Client[] = [
  {
    id: '1',
    nombre: 'Carlos López',
    email: 'carlos.lopez@empresaabc.com',
    telefono: '+54 9 11 1234-5678',
    empresa: 'Empresa ABC',
    fechaRegistro: '2024-01-15',
    estado: 'Activo'
  },
  {
    id: '2',
    nombre: 'Ana García',
    email: 'ana.garcia@empresaxyz.com',
    telefono: '+54 9 11 2345-6789',
    empresa: 'Empresa XYZ',
    fechaRegistro: '2024-02-20',
    estado: 'Activo'
  },
  {
    id: '3',
    nombre: 'Pedro Ramírez',
    email: 'pedro.ramirez@empresa123.com',
    telefono: '+54 9 11 3456-7890',
    empresa: 'Empresa 123',
    fechaRegistro: '2024-03-10',
    estado: 'Inactivo'
  },
  {
    id: '4',
    nombre: 'Sofía Martínez',
    email: 'sofia.martinez@empresadef.com',
    telefono: '+54 9 11 4567-8901',
    empresa: 'Empresa DEF',
    fechaRegistro: '2024-04-05',
    estado: 'Activo'
  }
]

const mockProducts: Product[] = [
  {
    id: '1',
    nombre: 'Crédito PyME Básico',
    tipo: 'Crédito Personal',
    tasaInteres: 18.5,
    montoMinimo: 10000,
    montoMaximo: 500000,
    plazoMaximo: 36,
    estado: 'Activo'
  },
  {
    id: '2',
    nombre: 'Crédito PyME Premium',
    tipo: 'Crédito Empresarial',
    tasaInteres: 15.8,
    montoMinimo: 100000,
    montoMaximo: 2000000,
    plazoMaximo: 60,
    estado: 'Activo'
  },
  {
    id: '3',
    nombre: 'Microcrédito Express',
    tipo: 'Microcrédito',
    tasaInteres: 22.0,
    montoMinimo: 5000,
    montoMaximo: 50000,
    plazoMaximo: 12,
    estado: 'Activo'
  },
  {
    id: '4',
    nombre: 'Crédito Construcción',
    tipo: 'Crédito Específico',
    tasaInteres: 16.5,
    montoMinimo: 200000,
    montoMaximo: 5000000,
    plazoMaximo: 84,
    estado: 'Inactivo'
  }
]

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [activeSection, setActiveSection] = useState('solicitudes')
  const [searchTerm, setSearchTerm] = useState('')
  const [estadoFilter, setEstadoFilter] = useState('Todos')
  const [fechaFilter, setFechaFilter] = useState('Reciente')
  const [montoFilter, setMontoFilter] = useState('Todos')

  const modules: Module[] = [
    {
      id: 'operations',
      name: 'Gestión',
      description: 'Gestión general de operaciones y solicitudes de crédito',
      logo: FiHome,
      active: true,
      permissionId: 'perm_operations_' + Math.random().toString(36).substr(2, 9),
      submodules: [
        {
          id: 'dashboard',
          name: 'Dashboard',
          description: 'Vista general del sistema',
          logo: FiHome,
          active: true,
          permissionId: 'perm_dashboard_' + Math.random().toString(36).substr(2, 9),
          route: '/admin/operations/dashboard'
        },
        {
          id: 'solicitudes',
          name: 'Solicitudes',
          description: 'Gestión de solicitudes de crédito',
          logo: FiFileText,
          active: true,
          permissionId: 'perm_solicitudes_' + Math.random().toString(36).substr(2, 9),
          route: '/admin/operations/solicitudes'
        }
      ]
    },
    {
      id: 'clients',
      name: 'Clientes',
      description: 'Gestión de clientes y PyMEs',
      logo: FiUsers,
      active: true,
      permissionId: 'perm_clients_' + Math.random().toString(36).substr(2, 9),
      submodules: [
        {
          id: 'mypes',
          name: 'PyMEs',
          description: 'Listado y gestión de PyMEs',
          logo: FiUsers,
          active: true,
          permissionId: 'perm_mypes_' + Math.random().toString(36).substr(2, 9),
          route: '/admin/clients/mypes'
        }
      ]
    },
    {
      id: 'products',
      name: 'Planes',
      description: 'Catálogo de productos financieros',
      logo: FiPackage,
      active: true,
      permissionId: 'perm_products_' + Math.random().toString(36).substr(2, 9),
      submodules: [
        {
          id: 'productos',
          name: 'Lista de planes',
          description: 'Lista de planes financieros disponibles',
          logo: FiPackage,
          active: true,
          permissionId: 'perm_productos_' + Math.random().toString(36).substr(2, 9),
          route: '/admin/products/productos'
        }
      ]
    },
    {
      id: 'settings',
      name: 'Configuración',
      description: 'Configuración del sistema',
      logo: FiSettings,
      active: true,
      permissionId: 'perm_settings_' + Math.random().toString(36).substr(2, 9),
      submodules: [
        {
          id: 'configuracion',
          name: 'Configuración',
          description: 'Configuración general del sistema',
          logo: FiSettings,
          active: true,
          permissionId: 'perm_configuracion_' + Math.random().toString(36).substr(2, 9),
          route: '/admin/settings/configuracion'
        }
      ]
    }
  ]

  const getActiveModules = () => {
    return modules.filter(module => module.active)
  }

  const getModuleById = (moduleId: string) => {
    return modules.find(module => module.id === moduleId)
  }

  const getSubmoduleByRoute = (route: string) => {
    for (const module of modules) {
      const submodule = module.submodules.find(sub => sub.route === route)
      if (submodule) {
        return { module, submodule }
      }
    }
    return undefined
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR')
  }

  const getFilteredApplications = () => {
    return mockCreditApplications.filter(app => {
      const matchesSearch = app.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           app.solicitante.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesEstado = estadoFilter === 'Todos' || app.estado === estadoFilter
      return matchesSearch && matchesEstado
    })
  }

  const getFilteredClients = () => {
    return mockClients.filter(client => {
      const matchesSearch = client.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           client.empresa.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesEstado = estadoFilter === 'Todos' || client.estado === estadoFilter
      return matchesSearch && matchesEstado
    })
  }

  const getFilteredProducts = () => {
    return mockProducts.filter(product => {
      const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.tipo.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesEstado = estadoFilter === 'Todos' || product.estado === estadoFilter
      return matchesSearch && matchesEstado
    })
  }

  const allSubmodules = modules.flatMap(module => {
    return module.submodules.map(sub => ({
      ...sub,
      moduleId: module.id,
      moduleName: module.name
    }))
  })

  const value: DashboardContextType = {
    modules,
    getActiveModules,
    getModuleById,
    getSubmoduleByRoute,
    
    activeSection,
    setActiveSection,
    searchTerm,
    setSearchTerm,
    estadoFilter,
    setEstadoFilter,
    fechaFilter,
    setFechaFilter,
    montoFilter,
    setMontoFilter,
    
    creditApplications: mockCreditApplications,
    clients: mockClients,
    products: mockProducts,
    allSubmodules,
    
    formatCurrency,
    formatDate,
    getFilteredApplications,
    getFilteredClients,
    getFilteredProducts
  }

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  )
}

export const useDashboard = () => {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider')
  }
  return context
}