import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { 
  getCreditApplicationByIdForAdmin, 
  updateCreditApplicationStatus,
  getAllowedStatusTransitions 
} from '@/services/admin.service'
import type { 
  CreditApplicationStatus, 
  UpdateCreditApplicationStatusData 
} from '@/interfaces/admin.interface'

interface CreditApplicationDetailModalProps {
  applicationId: string
  onClose: () => void
}

export const CreditApplicationDetailModal = ({ 
  applicationId, 
  onClose 
}: CreditApplicationDetailModalProps) => {
  const queryClient = useQueryClient()
  const [newStatus, setNewStatus] = useState<CreditApplicationStatus | ''>('')
  const [rejectionReason, setRejectionReason] = useState('')
  const [internalNotes, setInternalNotes] = useState('')
  const [userNotes, setUserNotes] = useState('')
  const [allowedTransitions, setAllowedTransitions] = useState<string[]>([])

  // Query para obtener los detalles de la solicitud
  const { data, isLoading, error } = useQuery({
    queryKey: ['creditApplicationDetail', applicationId],
    queryFn: () => getCreditApplicationByIdForAdmin(applicationId),
    staleTime: 10000,
  })

  // Query para obtener las transiciones permitidas
  const { data: transitionsData } = useQuery({
    queryKey: ['allowedTransitions', applicationId],
    queryFn: () => getAllowedStatusTransitions(applicationId),
    enabled: !!applicationId,
    staleTime: 10000,
  })

  // Actualizar las transiciones permitidas cuando se obtengan los datos
  useEffect(() => {
    if (transitionsData?.payload?.allowedTransitions) {
      setAllowedTransitions(transitionsData.payload.allowedTransitions)
    }
  }, [transitionsData])

  // Mutation para actualizar el estado
  const updateStatusMutation = useMutation({
    mutationFn: (updateData: UpdateCreditApplicationStatusData) => 
      updateCreditApplicationStatus(applicationId, updateData),
    onSuccess: () => {
      // Descartar toast de carga
      toast.dismiss('update-status')
      
      // Invalidar queries para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ['creditApplications'] })
      queryClient.invalidateQueries({ queryKey: ['creditApplicationDetail', applicationId] })
      
      // Resetear formulario
      setNewStatus('')
      setRejectionReason('')
      setInternalNotes('')
      setUserNotes('')
      
      // Toast de éxito
      toast.success('Estado actualizado exitosamente', {
        description: 'La solicitud ha sido actualizada correctamente',
        duration: 4000,
      })
    },
    onError: (error: Error) => {
      // Descartar toast de carga
      toast.dismiss('update-status')
      
      // Toast de error
      toast.error('Error al actualizar estado', {
        description: error.message || 'Ocurrió un error inesperado',
        duration: 5000,
      })
    },
  })

  const handleSubmitStatusUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newStatus) {
      toast.warning('Campo requerido', {
        description: 'Debes seleccionar un nuevo estado',
        duration: 3000,
      })
      return
    }

    // Validación para notas de usuario (ahora obligatorio)
    if (!userNotes.trim()) {
      toast.warning('Campo requerido', {
        description: 'Debes agregar notas para el usuario',
        duration: 3000,
      })
      return
    }

    // Validación para razón de rechazo
    if (newStatus === 'Rechazado' && !rejectionReason.trim()) {
      toast.warning('Campo requerido', {
        description: 'Debes especificar la razón del rechazo',
        duration: 3000,
      })
      return
    }

    const updateData: UpdateCreditApplicationStatusData = {
      newStatus: newStatus as CreditApplicationStatus,
      userNotes: userNotes,
    }

    if (rejectionReason) updateData.rejectionReason = rejectionReason
    if (internalNotes) updateData.internalNotes = internalNotes

    // Toast de carga
    toast.loading('Actualizando estado...', {
      id: 'update-status',
    })

    updateStatusMutation.mutate(updateData)
  }

  const application = data?.payload

  const getStatusBadgeClass = (status: string): string => {
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
      case 'Cancelado':
        badgeClasses += 'bg-gray-100 text-gray-700'
        break
      case 'No solicitado':
        badgeClasses += 'bg-gray-100 text-gray-600'
        break
      case 'No confirmado':
        badgeClasses += 'bg-indigo-100 text-indigo-700'
        break
      default:
        badgeClasses += 'bg-purple-100 text-purple-700'
    }
    
    return badgeClasses
  }

  const formatCurrency = (amount: number | null): string => {
    if (amount === null) return 'N/A'
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (date: string | null): string => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <p className="text-lg">Cargando detalles...</p>
        </div>
      </div>
    )
  }

  if (error || !application) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <p className="text-lg text-red-600">Error al cargar la solicitud</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cerrar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Detalle de Solicitud
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {application.applicationNumber}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {/* Estado Actual */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Estado Actual</p>
                <span className={getStatusBadgeClass(application.status)}>
                  {application.status}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Última actualización</p>
                <p className="text-sm font-medium">{formatDate(application.updatedAt)}</p>
              </div>
            </div>
          </div>

          {/* Información de la Empresa */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">Información de la Empresa</h3>
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Razón Social</p>
                <p className="font-medium">{application.company?.legalName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">CUIT</p>
                <p className="font-medium">{application.company?.cuit || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Industria</p>
                <p className="font-medium">{application.company?.industry?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fecha de Fundación</p>
                <p className="font-medium">
                  {application.company?.foundedDate 
                    ? new Date(application.company.foundedDate).toLocaleDateString('es-AR')
                    : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Ingresos Anuales</p>
                <p className="font-medium">{formatCurrency(application.company?.annualRevenue || null)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Cantidad de Empleados</p>
                <p className="font-medium">{application.company?.employeeCount || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Propietario */}
          {application.company?.owner && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Propietario</h3>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Nombre</p>
                  <p className="font-medium">
                    {application.company.owner.firstName} {application.company.owner.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{application.company.owner.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Detalles del Crédito */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">Detalles del Crédito</h3>
            <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Monto Solicitado</p>
                <p className="font-medium text-lg">{formatCurrency(application.selectedAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Plazo Seleccionado</p>
                <p className="font-medium text-lg">
                  {application.selectedTermMonths ? `${application.selectedTermMonths} meses` : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Monto Aprobado</p>
                <p className="font-medium text-lg text-green-600">
                  {formatCurrency(application.approvedAmount)}
                </p>
              </div>
            </div>
          </div>

          {/* Oferta del Sistema */}
          {application.offerDetails && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Oferta del Sistema</h3>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Rango de Monto</p>
                  <p className="font-medium">
                    {formatCurrency(application.offerDetails.minAmount)} - {formatCurrency(application.offerDetails.maxAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tasa de Interés</p>
                  <p className="font-medium">{application.offerDetails.interestRate}%</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Plazos Permitidos</p>
                  <p className="font-medium">
                    {application.offerDetails.allowedTerms.join(', ')} meses
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Revisión y Evaluación */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">Revisión y Evaluación</h3>
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Score de Riesgo</p>
                <p className="font-medium">
                  {application.riskScore !== null ? `${application.riskScore}/100` : 'No evaluado'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Revisado por</p>
                <p className="font-medium">
                  {application.reviewedBy ? application.reviewedBy.name : 'No asignado'}
                </p>
              </div>
              {application.rejectionReason && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Razón de Rechazo</p>
                  <p className="font-medium text-red-600">{application.rejectionReason}</p>
                </div>
              )}
              {application.userNotes && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Notas para el Usuario</p>
                  <p className="font-medium text-blue-600">{application.userNotes}</p>
                </div>
              )}
              {application.internalNotes && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Notas Internas (Solo Admin)</p>
                  <p className="font-medium">{application.internalNotes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Fechas Importantes */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">Fechas Importantes</h3>
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Fecha de Creación</p>
                <p className="font-medium">{formatDate(application.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fecha de Envío</p>
                <p className="font-medium">{formatDate(application.submittedAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fecha de Revisión</p>
                <p className="font-medium">{formatDate(application.reviewedAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fecha de Aprobación</p>
                <p className="font-medium">{formatDate(application.approvedAt)}</p>
              </div>
              {application.disbursedAt && (
                <div>
                  <p className="text-sm text-gray-600">Fecha de Desembolso</p>
                  <p className="font-medium">{formatDate(application.disbursedAt)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Historial de Estados */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">Historial de Estados</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              {application.statusHistory.length === 0 ? (
                <p className="text-gray-500 text-sm">No hay historial disponible</p>
              ) : (
                <div className="space-y-3">
                  {application.statusHistory.map((entry, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className={getStatusBadgeClass(entry.status)}>
                          {entry.status}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(entry.timestamp)}
                        </span>
                      </div>
                      {entry.reason && (
                        <p className="text-sm text-gray-600 mt-1">{entry.reason}</p>
                      )}
                      {entry.changedBy && (
                        <p className="text-xs text-gray-500 mt-1">
                          Cambio realizado por: {entry.changedBy}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Documentos */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">Documentos Adjuntos</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              {application.documents.length === 0 ? (
                <p className="text-gray-500 text-sm">No hay documentos adjuntos</p>
              ) : (
                <div className="space-y-2">
                  {application.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-2 bg-white rounded">
                      <div>
                        <p className="font-medium text-sm">{doc.name}</p>
                        <p className="text-xs text-gray-500">
                          Subido: {formatDate(doc.uploadedAt)}
                        </p>
                      </div>
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        Ver
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Formulario de Actualización de Estado */}
          <div className="mb-6 border-t pt-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Actualizar Estado de Solicitud</h3>
            <form onSubmit={handleSubmitStatusUpdate} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nuevo Estado *
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as CreditApplicationStatus)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Seleccionar estado...</option>
                    {allowedTransitions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  {allowedTransitions.length === 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      No hay transiciones de estado disponibles desde el estado actual
                    </p>
                  )}
                </div>

                {newStatus === 'Rechazado' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Razón de Rechazo *
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="Explicar la razón del rechazo..."
                      required={newStatus === 'Rechazado'}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas para el Usuario *
                  </label>
                  <textarea
                    value={userNotes}
                    onChange={(e) => setUserNotes(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Notas que verá el usuario sobre esta solicitud..."
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Estas notas serán visibles para el usuario de la empresa
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas Internas
                  </label>
                  <textarea
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Notas internas solo para administradores (opcional)..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Estas notas son privadas y solo visibles para administradores
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  disabled={updateStatusMutation.isPending}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                  disabled={updateStatusMutation.isPending}
                >
                  {updateStatusMutation.isPending ? 'Actualizando...' : 'Actualizar Estado'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
