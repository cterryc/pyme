import type { LoanRequestPayload } from '@/interfaces/loan.interface'
import { getSecureIdUrlSafe } from '@/config/SecureIdUrl'

interface UserCreditModalProps {
  getCredit: LoanRequestPayload | null
  setToggleModal: () => void
}

export const UserCreditModal = ({ getCredit, setToggleModal }: UserCreditModalProps) => {
  const formatCurrency = (amount: number): string => {
    if (amount === null) return 'N/A'
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const handleSignDocument = () => {
    const baseUrl = getSecureIdUrlSafe()
    if (!baseUrl) {
      console.error('URL de firma no configurada')
      return
    }

    const requestId = getCredit?.requestId
    if (!requestId) {
      console.error('ID de solicitud no disponible')
      return
    }

    const signUrl = `${baseUrl}/panel/firmar-documento?signId=${requestId}`
    window.open(signUrl, '_blank')
  }

  console.log(getCredit)
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
      <div className='max-w-3xl w-full bg-white rounded-2xl shadow-2xl animate-[fadeIn_0.2s_ease-out,scaleIn_0.2s_ease-out] overflow-hidden'>
        <div className='bg-gradient-to-r from-[#1193d4] to-[#0d7ab8] p-6 md:p-8 rounded-t-2xl'>
          <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4'>
            <div className='flex-1'>
              <h2 className='text-2xl md:text-3xl font-bold text-white'>Detalle de Solicitud</h2>
              <div className='mt-2 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg'>
                <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                  />
                </svg>
                <p className='text-sm font-medium text-white'>{getCredit?.applicationNumber}</p>
              </div>
            </div>
            <button
              onClick={setToggleModal}
              className='self-end sm:self-start text-white/80 hover:text-white hover:bg-white/20 transition-all duration-200 rounded-lg p-2 -m-2'
              aria-label='Cerrar modal'
            >
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
          </div>
        </div>

        <div className='p-6 space-y-8'>
          <section>
            <h3 className='text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2'>
              <span className='w-1 h-5 bg-blue-500 rounded'></span>
              Información de la Empresa
            </h3>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl'>
              <InfoItem label='Nombre Legal' value={getCredit?.legalName} />
              <InfoItem label='Ingreso Anual' value={getCredit?.annualRevenue} />
            </div>
          </section>

          <section>
            <h3 className='text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2'>
              <span className='w-1 h-5 bg-indigo-500 rounded'></span>
              Oferta del Sistema
            </h3>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl'>
              <InfoItem
                label='Rango de Monto'
                value={`${formatCurrency(getCredit?.offerDetails.minAmount || 0)} - ${formatCurrency(
                  getCredit?.offerDetails.maxAmount || 0
                )}`}
              />
              <InfoItem
                label='Plazos Permitidos'
                value={
                  getCredit?.offerDetails.allowedTerms
                    ? `${getCredit?.offerDetails.allowedTerms.join(', ')} meses`
                    : 'N/A'
                }
              />
              <InfoItem label='Tasa de Interés' value={`${getCredit?.offerDetails.interestRate ?? 0}%`} />
            </div>
          </section>

          <section>
            <h3 className='text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2'>
              <span className='w-1 h-5 bg-green-500 rounded'></span>
              Detalles del Crédito
            </h3>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl'>
              <InfoItem
                label='Plazo Seleccionado'
                value={getCredit?.selectedDetails.termMonths ? `${getCredit.selectedDetails.termMonths} meses` : 'N/A'}
                strong
              />
              <InfoItem
                label='Monto Aprobado'
                value={formatCurrency(Number(getCredit?.selectedDetails.amount) || 0)}
                valueClass='text-green-600 font-semibold text-lg'
              />
            </div>
          </section>

          <div className='flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200'>
            <button
              onClick={setToggleModal}
              className='flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-xl transition-all duration-200 hover:shadow-md'
            >
              Cerrar
            </button>
            <button
              onClick={handleSignDocument}
              className='flex-1 px-6 py-3 bg-gradient-to-r from-[#1193d4] to-[#0d7ab8] hover:from-[#0d7ab8] hover:to-[#0a6399] text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2'
            >
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                />
              </svg>
              Firmar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const InfoItem = ({
  label,
  value,
  strong,
  valueClass
}: {
  label: string
  value: string | number | undefined
  strong?: boolean
  valueClass?: string
}) => (
  <div>
    <p className='text-sm text-gray-600'>{label}</p>
    <p className={`mt-0.5 ${strong ? 'font-semibold text-gray-900' : 'font-medium text-gray-800'} ${valueClass ?? ''}`}>
      {value ?? 'N/A'}
    </p>
  </div>
)
