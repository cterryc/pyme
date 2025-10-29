import { formatDateToSpanish } from "@/helpers/formatDate";
import { useGetCreditApplicationById, useGetListCreditApplicationsByUser } from "@/hooks/useLoan";
import type { CreditAppplication, LoanRequestPayload } from "@/interfaces/loan.interface";
import { useEffect, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { UserCreditModal } from "./Modals/UserCreditModal";

export const UserCreditRequests = () => {
  const [creditId, setCreditId] = useState<string>('')
  const [toggleModal, setToggleModal] = useState<boolean>(false)
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


  const typeStatus = (status: string) => {
    switch (status) {
      case 'Enviado':
        return 'bg-[#0095d5]/80 text-white'
      case 'No confirmado':
        return 'bg-gray-200 text-black'
      default:
        return 'bg-gray-300 text-white'
    }
  }
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Solicitudes de crédito enviados</h2>
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
                <th className='p-3 text-center !w-full flex items-center justify-center'>Acciones</th>
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
                {
                  loansByUser &&
                  loansByUser.payload
                    .filter((cr) => cr.status === 'Enviado')
                    .map((credit: CreditAppplication, index) => {
                      const amount = '$' + credit.requestAmonut
                      return (
                        <tr key={index} className="hover:bg-gray-100 cursor-pointer border-b-2 border-gray-200">
                          <td className="p-3">{credit.nameCompany}</td>
                          <td className="p-3">{credit.requestAmonut ? amount : 'Sin Monto'}</td>
                          <td className="p-3">{formatDateToSpanish(credit.subbmitedAt)}</td>
                          <td className="p-3">
                            <span className={`block w-40 min-w-40 rounded-full px-6 py-2 text-center ${typeStatus(credit.status)}`}>
                              {credit.status}
                            </span>
                          </td>
                          <td
                            onClick={() => {
                              setToggleModal(true)
                              setCreditId(credit.id)
                            }}
                            className="text-blue-500 text-center"
                          >
                            Detalles
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
      {toggleModal && (
        <UserCreditModal
          getCredit={getCredit || null}
          setToggleModal={() => setToggleModal(!toggleModal)}
        />
      )}
    </>
  )
}
