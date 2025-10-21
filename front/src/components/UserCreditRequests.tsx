import { formatDateToSpanish } from "@/helpers/formatDate";
import { useGetListCreditApplicationsByUser } from "@/hooks/useLoan";
import type { CreditAppplication } from "@/interfaces/loan.interface";
import { useEffect } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

export const UserCreditRequests = () => {
  const { data: loansByUser, isLoading, isError, error, refetch } = useGetListCreditApplicationsByUser()
  const tableHeaders = ['Nombre Pyme', 'Monto Solicitado', 'Fecha', 'Estado']

  useEffect(() => {
    refetch()
  }, [refetch])

  const typeStatus = (status: string) => {
    switch(status) {
      case 'Enviado':
        return 'bg-[#0095d5] text-white'
      case 'No confirmado':
        return 'bg-gray-200 text-black'
      default:
        return 'bg-gray-300 text-white'
    }
  }
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Solicitudes de crédito registradas</h2>
      {isError && <p className='text-red-400'>Error: {error.message}</p>}
      {!isLoading && !isError && (
        <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-max border-collapse w-full">
            <thead className="text-gray-400 text-left">
              <tr className="border-b-2 border-gray-200">
                {tableHeaders.map(header => (
                  <th key={header} className="p-3 min-w-40">
                    <div className='flex items-center gap-1'>
                      {header} <MdKeyboardArrowDown className='mt-1 w-6 h-6 cursor-pointer' />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            {loansByUser?.payload.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={6} className='text-center text-gray-500 py-6'>
                    No se encontraron solicitudes de credito registradas.
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {loansByUser && loansByUser.payload.map((credit: CreditAppplication, index) => {
                  const amount = '$' + credit.requestAmonut
                  return (
                    <tr key={index} className="hover:bg-gray-100 cursor-pointer border-b-2 border-gray-200">
                      <td className="p-3">{credit.nameCompany}</td>
                      <td className="p-3">{credit.requestAmonut ? amount : 'Sin Monto'}</td>
                      <td className="p-3">{formatDateToSpanish(credit.subbmitedAt)}</td>
                      <td className="p-3">
                        <span className={`inline-block rounded-full px-6 py-2 ${typeStatus(credit.status)}`}>
                          {credit.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            )
            }
          </table>
        </div>
      )}
    </>
  )
}
