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
    const baseClasses = 'inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border '
    
    switch(status) {
      case 'Aprobado':
        return baseClasses + 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
      case 'Rechazado':
        return baseClasses + 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
      case 'En revisión':
        return baseClasses + 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
      case 'Enviado':
        return baseClasses + 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
      case 'Documentos requeridos':
        return baseClasses + 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100'
      case 'Desembolsado':
        return baseClasses + 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
      default:
        return baseClasses + 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8 min-h-screen">
        <div className="flex flex-col items-center justify-center h-96">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Cargando estadísticas...</p>
        </div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8 min-h-screen">
        <div className="flex flex-col items-center justify-center h-96">
          <div className="text-red-500 text-6xl mb-6">⚠️</div>
          <div className="text-center max-w-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Error al cargar estadísticas</h3>
            <p className="text-gray-600 bg-white px-4 py-3 rounded-lg shadow-sm">
              {(error as Error)?.message || 'Error desconocido'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Resumen general de solicitudes de crédito
        </p>
      </div>
      
      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {/* Total Solicitudes */}
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Solicitudes</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        {/* Aprobadas */}
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-200">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">Aprobadas</p>
              <p className="text-3xl font-bold text-gray-900">{stats.approved}</p>
              <div className="mt-2 flex items-center">
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {stats.total > 0 ? `${Math.round((stats.approved / stats.total) * 100)}%` : '0%'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Pendientes */}
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-200">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">Pendientes</p>
              <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
              <div className="mt-2 flex items-center">
                <span className="text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                  {stats.total > 0 ? `${Math.round((stats.pending / stats.total) * 100)}%` : '0%'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Rechazadas */}
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-200">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">Rechazadas</p>
              <p className="text-3xl font-bold text-gray-900">{stats.rejected}</p>
              <div className="mt-2 flex items-center">
                <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                  {stats.total > 0 ? `${Math.round((stats.rejected / stats.total) * 100)}%` : '0%'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Solicitudes recientes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Solicitudes Recientes</h3>
              <p className="text-sm text-gray-600 mt-1">Últimas solicitudes procesadas</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Actualizado hace poco</span>
            </div>
          </div>
        </div>
        <div className="p-6">
          {stats.recentApplications.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay solicitudes</h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                Las solicitudes aparecerán aquí cuando se creen
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentApplications.map((app, index) => (
                <div 
                  key={app.id} 
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-300 bg-gradient-to-r from-white to-gray-50 group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex-1 mb-4 sm:mb-0">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
                        {app.companyName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-base sm:text-lg truncate">
                          {app.companyName}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                            </svg>
                            {app.applicationNumber}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {app.submittedAt 
                              ? `Enviado: ${new Date(app.submittedAt).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}` 
                              : `Creado: ${new Date(app.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}`
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-end sm:items-end justify-between sm:justify-start gap-3 sm:gap-2 sm:text-right sm:ml-4">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-lg sm:text-xl font-bold text-gray-900">
                        {formatCurrency(app.approvedAmount || app.selectedAmount)}
                      </p>
                    </div>
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