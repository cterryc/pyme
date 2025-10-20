import { useState } from "react";
import type {
  CreditApplicationDetail,
  CreditApplicationStatus,
  UpdateCreditApplicationStatusRequest,
} from "@/interfaces/admin.interface";
import { formatDateToSpanish } from "@/helpers/formatDate";
import { toast } from "sonner";

interface LoanDetailModalProps {
  loan: CreditApplicationDetail | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, data: UpdateCreditApplicationStatusRequest) => void;
  isUpdating: boolean;
}

const STATUS_TRANSITIONS: Record<CreditApplicationStatus, CreditApplicationStatus[]> = {
  "No iniciado": ["No confirmado"],
  "No confirmado": ["Enviado", "Cancelado"],
  "Enviado": ["En revisión", "Cancelado"],
  "En revisión": ["Documentos requeridos", "Aprobado", "Rechazado"],
  "Documentos requeridos": ["En revisión", "Rechazado"],
  "Aprobado": ["Desembolsado", "Cancelado"],
  "Rechazado": [],
  "Desembolsado": [],
  "Cancelado": [],
};

export function LoanDetailModal({
  loan,
  isOpen,
  onClose,
  onUpdateStatus,
  isUpdating,
}: LoanDetailModalProps) {
  const [newStatus, setNewStatus] = useState<CreditApplicationStatus | "">("");
  const [reason, setReason] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [approvedAmount, setApprovedAmount] = useState("");
  const [riskScore, setRiskScore] = useState("");

  console.log('[LoanDetailModal] Render:', { isOpen, hasLoan: !!loan, loanId: loan?.id });

  if (!isOpen) {
    console.log('[LoanDetailModal] Modal cerrado - isOpen es false');
    return null;
  }
  
  if (!loan) {
    console.log('[LoanDetailModal] Modal cerrado - no hay loan data');
    return null;
  }

  console.log('[LoanDetailModal] Modal DEBERÍA MOSTRARSE AHORA');

  const allowedStatuses = loan.status ? STATUS_TRANSITIONS[loan.status] || [] : [];

  const handleUpdateStatus = () => {
    if (!newStatus) {
      toast.error("Debes seleccionar un nuevo estado");
      return;
    }

    if (newStatus === "Rechazado" && !reason) {
      toast.error("Debes proporcionar una razón para el rechazo");
      return;
    }

    if (newStatus === "Aprobado" && !approvedAmount) {
      toast.error("Debes proporcionar el monto aprobado");
      return;
    }

    const data: UpdateCreditApplicationStatusRequest = {
      status: newStatus,
    };

    if (reason) data.reason = reason;
    if (internalNotes) data.internalNotes = internalNotes;
    if (approvedAmount) data.approvedAmount = Number(approvedAmount);
    if (riskScore) data.riskScore = Number(riskScore);

    onUpdateStatus(loan.id, data);
    
    // Reset form
    setNewStatus("");
    setReason("");
    setInternalNotes("");
    setApprovedAmount("");
    setRiskScore("");
  };

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "N/A";
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Enviado":
        return "bg-blue-100 text-blue-800";
      case "En revisión":
        return "bg-yellow-100 text-yellow-800";
      case "Documentos requeridos":
        return "bg-orange-100 text-orange-800";
      case "Aprobado":
        return "bg-green-100 text-green-800";
      case "Rechazado":
        return "bg-red-100 text-red-800";
      case "Desembolsado":
        return "bg-purple-100 text-purple-800";
      case "Cancelado":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  console.log('[LoanDetailModal] Rendering modal content');
  
  return (
    <div 
      className="fixed inset-0 overflow-y-auto bg-black bg-opacity-50" 
      style={{ zIndex: 9999 }}
      aria-labelledby="modal-title" 
      role="dialog" 
      aria-modal="true"
    >
      <div className="flex items-center justify-center min-h-screen p-4">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" 
          onClick={onClose} 
          aria-hidden="true"
        ></div>

        {/* Modal content */}
        <div 
          className="relative bg-white rounded-lg text-left overflow-hidden shadow-2xl max-w-6xl w-full"
          style={{ zIndex: 10000 }}
        >
          {/* Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                Detalle de Solicitud: {loan.applicationNumber}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <span className={`mt-2 inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(loan.status)}`}>
              {loan.status}
            </span>
          </div>

          {/* Content */}
          <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Información de la Empresa */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Información de la Empresa</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Nombre Legal:</strong> {loan.company.legalName}</p>
                  <p><strong>CUIT/RFC:</strong> {loan.company.taxId}</p>
                  <p><strong>Email:</strong> {loan.company.email || "N/A"}</p>
                  <p><strong>Teléfono:</strong> {loan.company.phone || "N/A"}</p>
                  <p><strong>Industria:</strong> {loan.company.industry?.name || "N/A"}</p>
                  <p><strong>Empleados:</strong> {loan.company.employeeCount || "N/A"}</p>
                  <p><strong>Ingresos Anuales:</strong> {formatCurrency(loan.company.annualRevenue)}</p>
                  <p><strong>Fundada:</strong> {loan.company.foundedDate ? formatDateToSpanish(loan.company.foundedDate) : "N/A"}</p>
                </div>
              </div>

              {/* Información del Propietario */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Propietario</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Nombre:</strong> {loan.owner.firstName} {loan.owner.lastName}</p>
                  <p><strong>Email:</strong> {loan.owner.email}</p>
                  <p><strong>Teléfono:</strong> {loan.owner.phone || "N/A"}</p>
                </div>
              </div>

              {/* Detalles de la Oferta */}
              {loan.offerDetails && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Oferta del Sistema</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Monto Mínimo:</strong> {formatCurrency(loan.offerDetails.minAmount)}</p>
                    <p><strong>Monto Máximo:</strong> {formatCurrency(loan.offerDetails.maxAmount)}</p>
                    <p><strong>Tasa de Interés:</strong> {loan.offerDetails.interestRate}%</p>
                    <p><strong>Plazos Permitidos:</strong> {loan.offerDetails.allowedTerms.join(", ")} meses</p>
                  </div>
                </div>
              )}

              {/* Selección del Usuario */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Selección del Usuario</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Monto Solicitado:</strong> {formatCurrency(loan.selectedAmount)}</p>
                  <p><strong>Plazo:</strong> {loan.selectedTermMonths ? `${loan.selectedTermMonths} meses` : "N/A"}</p>
                  <p><strong>Monto Aprobado:</strong> {formatCurrency(loan.approvedAmount)}</p>
                  <p><strong>Risk Score:</strong> {loan.riskScore !== null ? `${loan.riskScore}/100` : "N/A"}</p>
                </div>
              </div>

              {/* Fechas */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Fechas</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Creado:</strong> {formatDateToSpanish(loan.createdAt)}</p>
                  <p><strong>Enviado:</strong> {loan.submittedAt ? formatDateToSpanish(loan.submittedAt) : "No enviado"}</p>
                  <p><strong>Revisado:</strong> {loan.reviewedAt ? formatDateToSpanish(loan.reviewedAt) : "No revisado"}</p>
                  <p><strong>Aprobado:</strong> {loan.approvedAt ? formatDateToSpanish(loan.approvedAt) : "No aprobado"}</p>
                  <p><strong>Desembolsado:</strong> {loan.disbursedAt ? formatDateToSpanish(loan.disbursedAt) : "No desembolsado"}</p>
                </div>
              </div>

              {/* Documentos */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Documentos ({loan.documents.length})</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {loan.documents.map((doc) => (
                    <div key={doc.id} className="flex justify-between items-center text-sm border-b pb-2">
                      <div>
                        <p className="font-medium">{doc.fileName}</p>
                        <p className="text-gray-500 text-xs">{doc.type}</p>
                      </div>
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs"
                      >
                        Ver
                      </a>
                    </div>
                  ))}
                  {loan.documents.length === 0 && (
                    <p className="text-gray-500 text-sm">No hay documentos cargados</p>
                  )}
                </div>
              </div>
            </div>

            {/* Historial de Estados */}
            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Historial de Estados</h4>
              <div className="space-y-3">
                {loan.statusHistory.map((history, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${getStatusColor(history.status)}`}>
                          {history.status}
                        </span>
                        <p className="text-sm text-gray-600 mt-1">{history.reason || "Sin razón especificada"}</p>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <p>{formatDateToSpanish(history.timestamp)}</p>
                        <p className="text-xs">{history.changedBy || "Sistema"}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Formulario de Actualización de Estado */}
            {allowedStatuses.length > 0 && (
              <div className="mt-6 bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Actualizar Estado</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nuevo Estado *
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as CreditApplicationStatus)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      disabled={isUpdating}
                    >
                      <option value="">Seleccionar estado...</option>
                      {allowedStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  {newStatus === "Aprobado" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Monto Aprobado *
                      </label>
                      <input
                        type="number"
                        value={approvedAmount}
                        onChange={(e) => setApprovedAmount(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Monto a aprobar"
                        disabled={isUpdating}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Risk Score (0-100)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={riskScore}
                      onChange={(e) => setRiskScore(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Score opcional"
                      disabled={isUpdating}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Razón {newStatus === "Rechazado" && "*"}
                    </label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Motivo del cambio de estado"
                      disabled={isUpdating}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notas Internas
                    </label>
                    <textarea
                      value={internalNotes}
                      onChange={(e) => setInternalNotes(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Notas privadas del admin"
                      disabled={isUpdating}
                    />
                  </div>
                </div>
              </div>
            )}

            {loan.internalNotes && (
              <div className="mt-4 bg-purple-50 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Notas Internas Previas</h4>
                <p className="text-sm text-gray-700">{loan.internalNotes}</p>
              </div>
            )}

            {loan.rejectionReason && (
              <div className="mt-4 bg-red-50 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Razón de Rechazo</h4>
                <p className="text-sm text-gray-700">{loan.rejectionReason}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              disabled={isUpdating}
            >
              Cerrar
            </button>
            {allowedStatuses.length > 0 && (
              <button
                onClick={handleUpdateStatus}
                disabled={!newStatus || isUpdating}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? "Actualizando..." : "Actualizar Estado"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
