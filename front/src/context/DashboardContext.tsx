import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

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

  // Funciones utilitarias
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR')
  }

  // Filtros para solicitudes
  const getFilteredApplications = () => {
    return mockCreditApplications.filter(app => {
      const matchesSearch = app.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           app.solicitante.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesEstado = estadoFilter === 'Todos' || app.estado === estadoFilter
      return matchesSearch && matchesEstado
    })
  }

  // Filtros para clientes
  const getFilteredClients = () => {
    return mockClients.filter(client => {
      const matchesSearch = client.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           client.empresa.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesEstado = estadoFilter === 'Todos' || client.estado === estadoFilter
      return matchesSearch && matchesEstado
    })
  }

  // Filtros para productos
  const getFilteredProducts = () => {
    return mockProducts.filter(product => {
      const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.tipo.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesEstado = estadoFilter === 'Todos' || product.estado === estadoFilter
      return matchesSearch && matchesEstado
    })
  }

  const value: DashboardContextType = {
    // Estado
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
    
    // Datos
    creditApplications: mockCreditApplications,
    clients: mockClients,
    products: mockProducts,
    
    // Funciones
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