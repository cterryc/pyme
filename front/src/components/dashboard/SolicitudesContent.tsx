import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { SearchBar } from '../SearchBar'
import { FilterDropdown } from '../FilterDropdown'
import { DataTable } from '../DataTable'
import { getCreditApplicationsForAdmin } from '@/services/admin.service'
import { CreditApplicationDetailModal } from './CreditApplicationDetailModal'
import type { CreditApplicationStatus, AdminCreditApplication } from '@/interfaces/admin.interface'

export const SolicitudesContent = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [estadoFilter, setEstadoFilter] = useState<string>('Todos')
  const [page, setPage] = useState(1)
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null)
  const limit = 10

  // Mapeo de filtros (español UI) -> valores backend (español DB)
  const statusFilterToBackend: Record<string, string | undefined> = {
    'Todos': undefined,
    'Enviado': 'Enviado',
    'En Revisión': 'En revisión',
    'Docs. Requeridos': 'Documentos requeridos',
    'Aprobado': 'Aprobado',
    'Rechazado': 'Rechazado',
    'Desembolsado': 'Desembolsado',
    'Borrador': 'No solicitado',
    'Aplicando': 'No confirmado',
    'Cancelado': 'Cancelado'
  }

  // Query para obtener las solicitudes del backend
  const { data, isLoading, error } = useQuery({
    queryKey: ['creditApplications', page, estadoFilter, searchTerm],
    queryFn: () => getCreditApplicationsForAdmin({
      page,
      limit,
      status: statusFilterToBackend[estadoFilter] as CreditApplicationStatus | undefined,
      companyName: searchTerm || undefined
    }),
    staleTime: 30000, // 30 segundos
  })

  // Configuración de columnas para la tabla
  const tableColumns = [
    { key: 'companyName', label: 'EMPRESA', width: '18%' },
    { 
      key: 'submittedAt', 
      label: 'FECHA DE SOLICITUD', 
      render: (value: string | null) => value 
        ? new Date(value).toLocaleDateString('es-AR', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit' 
          })
        : 'Sin fecha'
    },
    { 
      key: 'selectedAmount', 
      label: 'MONTO', 
      render: (value: number | null) => value 
        ? new Intl.NumberFormat('es-AR', { 
            style: 'currency', 
            currency: 'ARS',
            maximumFractionDigits: 0
          }).format(value)
        : 'N/A'
    },
    { 
      key: 'annualRevenue', 
      label: 'INGRESOS ANUALES', 
      render: (_value: unknown, row: AdminCreditApplication) => row.company?.annualRevenue 
        ? new Intl.NumberFormat('es-AR', { 
            style: 'currency', 
            currency: 'ARS',
            maximumFractionDigits: 0
          }).format(row.company.annualRevenue)
        : 'N/A'
    },
    { 
      key: 'employeeCount', 
      label: 'EMPLEADOS', 
      render: (_value: unknown, row: AdminCreditApplication) => row.company?.employeeCount || 'N/A'
    },
    { 
      key: 'status', 
      label: 'ESTADO', 
      render: (value: string) => {
        // Mapeo de estados con estilos completos
        let badgeClasses = 'inline-flex items-center justify-center min-w-32 w-32 py-2 text-center rounded-full text-xs font-medium '
        let label = value
        
        switch(value) {
          case 'No solicitado':
            badgeClasses += 'bg-gray-100 text-gray-700'
            label = 'Borrador'
            break
          case 'No confirmado':
            badgeClasses += 'bg-blue-100 text-blue-700'
            label = 'Aplicando'
            break
          case 'Enviado':
            badgeClasses += 'bg-indigo-100 text-indigo-700'
            label = 'Enviado'
            break
          case 'En revisión':
            badgeClasses += 'bg-purple-100 text-purple-700'
            label = 'En Revisión'
            break
          case 'Documentos requeridos':
            badgeClasses += 'bg-orange-100 text-orange-700'
            label = 'Docs. Requeridos'
            break
          case 'Aprobado':
            badgeClasses += 'bg-green-100 text-green-700'
            label = 'Aprobado'
            break
          case 'Rechazado':
            badgeClasses += 'bg-red-100 text-red-700'
            label = 'Rechazado'
            break
          case 'Desembolsado':
            badgeClasses += 'bg-emerald-100 text-emerald-700'
            label = 'Desembolsado'
            break
          case 'Cancelado':
            badgeClasses += 'bg-gray-200 text-gray-700'
            label = 'Cancelado'
            break
          case 'No aplica':
            badgeClasses += 'bg-gray-100 text-gray-500'
            label = 'No Aplicable'
            break
          default:
            badgeClasses += 'bg-gray-100 text-gray-700'
            label = value
        }
        
        return (
          <span className={badgeClasses}>
            {label}
          </span>
        )
      }
    },
    { 
      key: 'acciones', 
      label: 'ACCIONES', 
      width: '10%',
      render: (_value: unknown, row: AdminCreditApplication) => (
        <button 
          onClick={() => setSelectedApplicationId(row.id)}
          className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center w-full"
        >
          Detalles
        </button>
      )
    }
  ]

  const applications = data?.payload?.applications || []
  const totalPages = data?.payload?.totalPages || 1

  return (
    <>
      {selectedApplicationId && (
        <CreditApplicationDetailModal
          applicationId={selectedApplicationId}
          onClose={() => setSelectedApplicationId(null)}
        />
      )}
      
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
              options={[
                'Todos', 
                'Enviado', 
                'En Revisión', 
                'Docs. Requeridos', 
                'Aprobado', 
                'Rechazado',
                'Desembolsado'
              ]}
              onChange={setEstadoFilter}
            />
          </div>
        </div>
      </div>

      {/* Estado de carga y errores */}
      {isLoading && (
        <div className="px-8 py-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Cargando solicitudes...</p>
        </div>
      )}

      {error && (
        <div className="px-8 py-12 text-center">
          <div className="text-red-400 text-5xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar solicitudes</h3>
          <p className="text-gray-500">{(error as Error).message}</p>
        </div>
      )}

      {/* Tabla de datos */}
      {!isLoading && !error && (
        <>
          <div className="px-8 py-6">
            <DataTable
              columns={tableColumns}
              data={applications}
              onRowClick={(row) => console.log('Clicked row:', row)}
            />
            
            {applications.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-5xl mb-4">📋</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron solicitudes</h3>
                <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
              </div>
            )}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="px-8 py-4 border-t border-gray-200 flex items-center justify-between">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              
              <span className="text-sm text-gray-700">
                Página {page} de {totalPages}
              </span>
              
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
      </div>
    </>
  )
}
