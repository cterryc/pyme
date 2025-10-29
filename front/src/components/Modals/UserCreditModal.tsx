import type { LoanRequestPayload } from "@/interfaces/loan.interface"

interface UserCreditModalProps {
  getCredit: LoanRequestPayload | null
  setToggleModal: () => void
}

export const UserCreditModal = ({getCredit, setToggleModal}: UserCreditModalProps) => {
  const formatCurrency = (amount: number): string => {
    if (amount === null) return 'N/A'
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="fixed top-0 left-0 w-full min-h-screen bg-black/50 outline flex items-center justify-center z-50">
      <div className="max-w-3xl w-full bg-white rounded-md">
        <div className="border-b p-5 flex justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Detalle de Solicitud
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {getCredit?.applicationNumber}
            </p>
          </div>
          <button
            onClick={setToggleModal}
            className="text-gray-400 hover:text-gray-600 transition text-2xl font-bold right-0 cursor-pointer"
          >
            ×
          </button>
        </div>
        <div className="px-5 pb-5">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 mt-6">Información de la Empresa</h3>
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Nombre Legal</p>
              <p className="font-medium">{getCredit?.legalName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Ingreso Anual</p>
              <p className="font-medium">{getCredit?.annualRevenue || 'N/A'}</p>
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900 mt-6">Oferta del Sistema</h3>
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Rango de Monto</p>
              <p className="font-medium">
                {formatCurrency(getCredit?.offerDetails.minAmount || 0)} - {formatCurrency(getCredit?.offerDetails.maxAmount || 0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Plazos Permitidos</p>
              <p className="font-medium">
                {getCredit?.offerDetails.allowedTerms.join(', ')} meses
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tasa de Interés</p>
              <p className="font-medium">{getCredit?.offerDetails.interestRate}%</p>
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-3 text-gray-900 mt-6">Detalles del Crédito</h3>
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Plazo Seleccionado</p>
              <p className="font-medium text-lg">
                {getCredit?.selectedDetails.termMonths ? `${getCredit?.selectedDetails.termMonths} meses` : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Monto Aprobado</p>
              <p className="font-medium text-lg text-green-600">
                {formatCurrency(Number(getCredit?.selectedDetails.amount) || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
