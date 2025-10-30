import { formatDateToSpanish } from "@/helpers/formatDate";
import { useGetCreditApplicationById, useGetListCreditApplicationsByUser } from "@/hooks/useLoan";
import type { CreditAppplication, LoanRequestPayload } from "@/interfaces/loan.interface";
import { useEffect, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { UserCreditModal } from "./Modals/UserCreditModal";
import { CongratsModal } from "./Modals/CongratsModal";

export const UserCreditRequests = () => {
  const [creditId, setCreditId] = useState<string>('')
  const [toggleModal, setToggleModal] = useState<boolean>(false)
  const [showCongratsModal, setShowCongratsModal] = useState<boolean>(false)
  const [getCredit, setGetCredit] = useState<LoanRequestPayload | null>(null);
  const { data: loansByUser, isLoading, isError, error, refetch } = useGetListCreditApplicationsByUser()
  const { data: creditById } = useGetCreditApplicationById(creditId)
  const tableHeaders = ['Nombre Pyme', 'Monto Solicitado', 'Fecha de envio', 'Estado del credito']

  useEffect(() => {
    refetch()
  }, [refetch])

  useEffect(() => {
    if (creditById?.payload) {
      setGetCredit(creditById.payload);
    }
  }, [creditById])

  useEffect(() => {
    // Esto se guarda en localstorage, pero se comenta para pruebas. Si quieres trabajar con localstorage, descomenta las líneas correspondientes.
    if (loansByUser?.payload) {
      const hasApprovedLoan = loansByUser.payload.some(
        (loan) => loan.status === 'Aprobado'
      );
      if (hasApprovedLoan) {
        //const hasShownCongrats = localStorage.getItem('hasShownCongratsModal');
        //if (!hasShownCongrats) {
          setShowCongratsModal(true);
          //localStorage.setItem('hasShownCongratsModal', 'true');
        //}
      }
    }
  }, [loansByUser])


  const typeStatus = (status: string) => {
    switch (status) {
      case 'Aprobado':
        return 'bg-green-400 text-white shadow-sm'
      case 'Enviado':
        return 'bg-blue-500 text-white shadow-sm'
      case 'En revisión':
        return 'bg-purple-400 text-white shadow-sm'
      case 'Rechazado':
        return 'bg-red-500 text-white shadow-sm'
      case 'No confirmado':
        return 'bg-gray-200 text-gray-700'
      default:
        return 'bg-gray-300 text-gray-700'
    }
  }
  
  return (
    <div className='w-full px-2 sm:px-4 lg:px-0'>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-green-100 text-green-600">
          <FaFileInvoiceDollar size={28} />
        </div>

        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
            Solicitudes de Crédito
          </h2>
          <p className="text-gray-600 text-base sm:text-lg">
            Gestiona y revisa las solicitudes de crédito enviadas por tus empresas.
          </p>
        </div>
      </div>

      {isError && (
        <div className='bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-6'>
          <p className='text-red-700 font-medium'>Error: {error.message}</p>
        </div>
      )}
      
      {!isLoading && !isError && (
        <>
          <div className="hidden lg:block w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
            <table className="min-w-full border-collapse w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr className="border-b border-gray-300">
                  {tableHeaders.map(header => (
                    <th key={header} className="p-4 text-left">
                      <div className='flex items-center gap-2 text-gray-700 font-semibold text-sm uppercase tracking-wide'>
                        {header} 
                        <MdKeyboardArrowDown className='w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors' />
                      </div>
                    </th>
                  ))}
                  <th className='p-4 text-center text-gray-700 font-semibold text-sm uppercase tracking-wide'>
                    Acciones
                  </th>
                </tr>
              </thead>
              {loansByUser?.payload.filter((cr) => 
                cr.status === 'Enviado' || 
                cr.status === 'Aprobado' || 
                cr.status === 'En revisión' || 
                cr.status === 'Rechazado'
              ).length === 0 ? (
                <tbody>
                  <tr>
                    <td colSpan={5} className='text-center text-gray-500 py-12'>
                      <div className='flex flex-col items-center gap-3'>
                        <svg className='w-16 h-16 text-gray-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                        </svg>
                        <p className='text-lg font-medium'>No se encontraron solicitudes de crédito registradas.</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody className='divide-y divide-gray-200'>
                  {loansByUser &&
                    loansByUser.payload
                      .filter((cr) => 
                        cr.status === 'Enviado' || 
                        cr.status === 'Aprobado' || 
                        cr.status === 'En revisión' || 
                        cr.status === 'Rechazado'
                      )
                      .map((credit: CreditAppplication) => {
                        const amount = new Intl.NumberFormat('es-PE', {
                          style: 'currency',
                          currency: 'PEN'
                        }).format(Number(credit.requestAmonut))
                        
                        return (
                          <tr key={credit.id} className="hover:bg-blue-50/50 transition-colors duration-150">
                            <td className="p-4">
                              <span className='font-medium text-gray-900'>{credit.nameCompany}</span>
                            </td>
                            <td className="p-4">
                              <span className='font-semibold text-green-600'>
                                {credit.requestAmonut ? amount : 'Sin Monto'}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className='text-gray-600'>
                                {formatDateToSpanish(credit.subbmitedAt)}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold text-center min-w-[120px] ${typeStatus(credit.status)}`}>
                                {credit.status}
                              </span>
                            </td>
                            <td className="p-4">
                              <button
                                onClick={() => {
                                  setToggleModal(true)
                                  setCreditId(credit.id)
                                }}
                                className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                              >
                                Ver Detalles
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                </tbody>
              )}
            </table>
          </div>

          <div className='lg:hidden w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white'>
            <table className='min-w-[800px] border-collapse w-full'>
              <thead className='bg-gradient-to-r from-gray-50 to-gray-100'>
                <tr className='border-b border-gray-300'>
                  {tableHeaders.map(header => (
                    <th key={header} className='p-3 text-left'>
                      <div className='flex items-center gap-2 text-gray-700 font-semibold text-xs uppercase tracking-wide'>
                        {header} 
                        <MdKeyboardArrowDown className='w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors' />
                      </div>
                    </th>
                  ))}
                  <th className='p-3 text-center text-gray-700 font-semibold text-xs uppercase tracking-wide'>
                    Acciones
                  </th>
                </tr>
              </thead>
              {loansByUser?.payload.filter((cr) => 
                cr.status === 'Enviado' || 
                cr.status === 'Aprobado' || 
                cr.status === 'En revisión' || 
                cr.status === 'Rechazado'
              ).length === 0 ? (
                <tbody>
                  <tr>
                    <td colSpan={5} className='text-center text-gray-500 py-12'>
                      <div className='flex flex-col items-center gap-3'>
                        <svg className='w-12 h-12 text-gray-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                        </svg>
                        <p className='text-sm font-medium'>No se encontraron solicitudes de crédito registradas.</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody className='divide-y divide-gray-200'>
                  {loansByUser &&
                    loansByUser.payload
                      .filter((cr) => 
                        cr.status === 'Enviado' || 
                        cr.status === 'Aprobado' || 
                        cr.status === 'En revisión' || 
                        cr.status === 'Rechazado'
                      )
                      .map((credit: CreditAppplication) => {
                        const amount = new Intl.NumberFormat('es-PE', {
                          style: 'currency',
                          currency: 'PEN'
                        }).format(Number(credit.requestAmonut))
                        
                        return (
                          <tr key={credit.id} className='hover:bg-blue-50/50 transition-colors duration-150'>
                            <td className='p-3'>
                              <span className='font-medium text-gray-900 text-sm'>{credit.nameCompany}</span>
                            </td>
                            <td className='p-3'>
                              <span className='font-semibold text-green-600 text-sm whitespace-nowrap'>
                                {credit.requestAmonut ? amount : 'Sin Monto'}
                              </span>
                            </td>
                            <td className='p-3'>
                              <span className='text-gray-600 text-xs whitespace-nowrap'>
                                {formatDateToSpanish(credit.subbmitedAt)}
                              </span>
                            </td>
                            <td className='p-3'>
                              <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold text-center whitespace-nowrap ${typeStatus(credit.status)}`}>
                                {credit.status}
                              </span>
                            </td>
                            <td className='p-3'>
                              <button
                                onClick={() => {
                                  setToggleModal(true)
                                  setCreditId(credit.id)
                                }}
                                className='w-full px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md text-xs whitespace-nowrap'
                              >
                                Ver Detalles
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                </tbody>
              )}
            </table>
          </div>
        </>
      )}
      
      {toggleModal && (
        <UserCreditModal
          getCredit={getCredit || null}
          setToggleModal={() => setToggleModal(!toggleModal)}
        />
      )}

      <CongratsModal
        isOpen={showCongratsModal}
        onClose={() => setShowCongratsModal(false)}
      />
    </div>
  )
}
