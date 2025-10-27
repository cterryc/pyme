import { useQuery } from '@tanstack/react-query'
import { getDashboardStats } from '@/services/admin.service'
import type { CreditApplicationStatus } from '@/interfaces/admin.interface'

export const DashboardOverview = () => {
  // Query para obtener las estadísticas del dashboard
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats,
    staleTime: 30000, // 30 segundos
    refetchInterval: 60000, // Refrescar cada minuto
  })

  const stats = data?.payload

  const formatCurrency = (amount: number | null): string => {
    if (amount === null) return 'N/A'
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusBadgeClass = (status: CreditApplicationStatus): string => {
    let badgeClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium '
    
    switch(status) {
      case 'Aprobado':
        badgeClasses += 'bg-green-100 text-green-700'
        break
      case 'Rechazado':
        badgeClasses += 'bg-red-100 text-red-700'
        break
      case 'En revisión':
        badgeClasses += 'bg-yellow-100 text-yellow-700'
        break
      case 'Enviado':
        badgeClasses += 'bg-blue-100 text-blue-700'
        break
      case 'Documentos requeridos':
        badgeClasses += 'bg-orange-100 text-orange-700'
        break
      case 'Desembolsado':
        badgeClasses += 'bg-emerald-100 text-emerald-700'
        break
      default:
        badgeClasses += 'bg-gray-100 text-gray-700'
    }
    
    return badgeClasses
  }

  if (isLoading) {
    return (
      <div className="flex-1 bg-white p-8">
        <div className="flex items-center justify-center h-64">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="ml-4 text-gray-600">Cargando estadísticas...</p>
        </div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="flex-1 bg-white p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-400 text-5xl mb-4">⚠️</div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar estadísticas</h3>
            <p className="text-gray-500">{(error as Error)?.message || 'Error desconocido'}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
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
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
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
              <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
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
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
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
              <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
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
          {stats.recentApplications.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-5xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay solicitudes</h3>
              <p className="text-gray-500">Las solicitudes aparecerán aquí cuando se creen</p>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.recentApplications.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition">
                  <div>
                    <p className="font-medium text-gray-900">{app.companyName}</p>
                    <p className="text-sm text-gray-600">
                      {app.applicationNumber}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {app.submittedAt 
                        ? `Enviado: ${new Date(app.submittedAt).toLocaleDateString('es-AR')}` 
                        : `Creado: ${new Date(app.createdAt).toLocaleDateString('es-AR')}`
                      }
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 mb-2">
                      {formatCurrency(app.approvedAmount || app.selectedAmount)}
                    </p>
                    <span className={getStatusBadgeClass(app.status)}>
                      {app.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}