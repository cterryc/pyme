import { useEffect, useState } from 'react'

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

interface DashboardContextType {
  // Filtros
  setSearchTerm: (term: string) => void
  setEstadoFilter: (estado: string) => void
  setCurrentPage: (page: number) => void
  setItemsPerPage: (items: number) => void
  setIndustryFilter: (industry: string) => void
  //   fechaFilter: string
  //   setFechaFilter: (fecha: string) => void
  //   montoFilter: string
  //   setMontoFilter: (monto: string) => void

  // Datos
  clients: Client[]
  getFilteredClients: () => Client[]
  industryList: Array<{ id: string; name: string }>

  //flags
  searchTerm: string
  estadoFilter: string
  isLoading: boolean
  currentPage: number
  industryFilter: string
  totalClients: number
  totalPages: number
  errors: string[]
}

export const useDashboard = (): DashboardContextType => {
  //temporal
  const adminToken = localStorage.getItem('tokenPyme')
  const [searchTerm, setSearchTerm] = useState('')
  const [estadoFilter, setEstadoFilter] = useState('')
  const [industryFilter, setIndustryFilter] = useState('')
  const [clients, setClients] = useState<Array<Client>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [totalClients, setTotalClients] = useState(0)
  const [industryList, setIndustryList] = useState<Array<{ id: string; name: string }>>([])
  const [errors, setErrors] = useState<string[]>([])

  //Buscar al toke perri
  useEffect(() => {
    const fetchClients = async (page = 1, search = '', industry = '', status = '') => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: itemsPerPage.toString()
        })
        if (search) params.append('search', search)
        if (industry) params.append('industryId', industry)
        if (status) params.append('status', status)

        const response = await fetch(`${import.meta.env.VITE_API_URL}/companies/all?${params}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`
          }
        })

        const data = await response.json()

        console.log(
          'La data que llega para los parametros' + '|  ',
          params.toString().split('&'),
          '  |' + ' es : ',
          data.payload
        )
        if (data.success) {
          setClients(data.payload.data)
          setCurrentPage(data.payload.pagination.page)
          setTotalClients(data.payload.pagination.total)
          setTotalPages(data.payload.pagination.totalPages)
        } else {
          setErrors((prev) => [...prev, 'No tienes permisos para realizar esta accion'])
        }
      } catch (error) {
        console.error('useDashboard[fetchClients]', error)
      } finally {
        setIsLoading(false)
      }
    }

    const timeoutId = setTimeout(() => {
      fetchClients(currentPage, searchTerm, industryFilter, estadoFilter)
    }, 300) // debounce de 300ms
    // const timeoutId = setTimeout(() => {
    //   fetchClients(currentPage, searchTerm, industryFilter, estadoFilter)
    // }, 1) // debounce de 300ms

    return () => clearTimeout(timeoutId)
  }, [searchTerm, estadoFilter, itemsPerPage, adminToken, currentPage, industryFilter])

  //Obtener los filtros por industria
  useEffect(() => {
    const fetchIndustriesOptions = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/companies/industries`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`
          }
        })
        const data = await response.json()

        //   console.log(data.payload)
        setIndustryList(data.payload)
      } catch (error) {
        console.error('useDashboard[fetchIndustriesOptions]', error)
      }
    }
    fetchIndustriesOptions()
  }, [adminToken])

  const getFilteredClients = () => {
    return clients
  }

  return {
    errors,
    searchTerm,
    setSearchTerm,
    estadoFilter,
    setEstadoFilter,
    clients,
    getFilteredClients,
    isLoading,
    currentPage,
    setCurrentPage,
    setItemsPerPage,
    setIndustryFilter,
    industryFilter,
    totalClients,
    totalPages,
    industryList
  }
}
