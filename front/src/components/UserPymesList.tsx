import { useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { FaPlus } from 'react-icons/fa'
import { MdKeyboardArrowDown } from 'react-icons/md'
import type { GetPymeResponse } from '@/interfaces/pyme.interface'
import { useGetPymesByUser } from '@/hooks/usePyme'
import { PymeTableSkeleton } from './Loaders/PymeTableSkeleton'
import { toast } from 'sonner'
import { BLOCKED_STATUSES } from '@/interfaces/loan.interface'

export const UserPymesList = () => {
  const navigate = useNavigate()

  const { data: pymesByUser, isLoading, isError, error, refetch } = useGetPymesByUser()
  const tableHeaders = ['Nombre Legal', 'Sector', 'Documentos', 'Solicitud de credito']

  // temporal - para refrescar los datos cuando se actualice algun registro
  useEffect(() => {
    refetch()
  }, [refetch])

  // const editPyme = (pymeId: string) => {
  //   navigate(`/panel/registro-pyme`, { state: { pymeId } })
  // }

  const statusActions = (status: string, hasDocument: boolean) => {
    if (!hasDocument) {
      return 'Sin Documentos'
    } else if (status === 'Enviado') {
      return 'Credito Aplicado'
    } else if (status === 'No confirmado') {
      return 'Confirmar Credito'
    } else if (status === 'No solicitado') {
      return 'Solicitar Credito'
    } else if (status === 'No aplica') {
      return 'No aplica'
    } else {
      return ''
    }
  }

  return (
    <>
      <h2 className='text-2xl font-semibold mb-4 text-gray-700'>Pymes registradas</h2>
      {isLoading && <PymeTableSkeleton />}
      {isError && <p className='text-red-400'>Error: {error.message}</p>}
      {!isLoading && !isError && (
        <div className='w-full overflow-x-auto rounded-lg border border-gray-200'>
          <table className='min-w-max border-collapse w-full'>
            <thead className='text-gray-400 text-left'>
              <tr className='border-b-2 border-gray-200'>
                {tableHeaders.map((header) => (
                  <th key={header} className='p-3 min-w-40'>
                    <div className='flex items-center gap-1'>
                      {header} <MdKeyboardArrowDown className='mt-1 w-6 h-6 cursor-pointer' />
                    </div>
                  </th>
                ))}
                <th className='p-3 text-center !w-[150px]'>Acciones</th>
              </tr>
            </thead>
            {pymesByUser?.payload.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={6} className='text-center text-gray-500 py-6'>
                    No se encontraron pymes registradas.
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {pymesByUser &&
                  pymesByUser.payload.map((pyme: GetPymeResponse, index) => {
                    const isLast = index === pymesByUser.payload.length - 1
                    const isBlocked = BLOCKED_STATUSES.includes(pyme.statusCredit)
                    console.log("pyme.statusCredit", pyme.statusCredit)
                    const canRequestCredit = pyme.hasDocuments && !isBlocked

                    return (
                      <tr key={index} className='hover:bg-gray-100 cursor-pointer border-b-2 border-gray-200'>
                        <td className='p-3'>{pyme.legalName}</td>
                        <td className='p-3'>{pyme.industryName}</td>
                        <td className='p-3'>
                          {pyme.hasDocuments ? (
                            <span className='py-2 rounded-full text-[#12b92f] font-bold'>Documentos Registrados</span>
                          ) : (
                            <span
                              onClick={() => {
                                toast.info('Completar registro de documentos', {
                                  style: { borderColor: '#0095d5', backgroundColor: '#e6f4fb', borderWidth: '2px' },
                                  description:
                                    'Debes adjuntar y firmar los documentos para poder solicitar un crédito.',
                                  duration: 3000
                                })
                                navigate(`/panel/registro-documentos/${pyme.id}`)
                              }}
                              className='bg-gray-500 hover:bg-gray-400 rounded-md text-white px-4 py-2'
                            >
                              Adjuntar Documentos
                            </span>
                          )}
                        </td>
                        <td className='p-3'>
                          <span
                            className={`block w-40 min-w-40 rounded-full px-6 py-2 text-gray-700 text-center
                          ${pyme.statusCredit === 'Enviado' ? 'bg-[#0095d5]/80 text-white' : 'bg-gray-200 text-gray-500'}
                          ${!pyme.hasDocuments && 'hidden'}
                        `}
                          >
                            {pyme.statusCredit}
                          </span>
                        </td>
                        <td className='p-3 flex gap-3'>
                          {/* <button
                            onClick={()=>editPyme(pyme.id)}
                            className='bg-[#0095d5] text-white px-4 py-2 rounded-md hover:bg-[#28a9d6] transition-colors cursor-pointer text-nowrap'
                          >
                            Editar Pyme
                          </button> */}
                          <div className="relative inline-block group">
                            <button
                              onClick={() => {
                                if (canRequestCredit) navigate(`/panel/solicitar-credito/${pyme.id}`)
                              }}
                              className={`relative block w-40 min-w-40 px-4 py-2 rounded-md font-semibold transition-colors text-nowrap
      ${canRequestCredit
                                  ? 'bg-[#0095d5] hover:bg-[#28a9d6] cursor-pointer text-white'
                                  : 'bg-gray-200 cursor-default text-gray-600 select-none opacity-70'
                                }
    `}
                              disabled={isBlocked}
                            >
                              {statusActions(pyme.statusCredit, pyme.hasDocuments)}
                            </button>
                            {pyme.hasDocuments && pyme.statusCredit === 'No aplica' && (
                              <div
                                className={`absolute right-0 w-72 hidden group-hover:block bg-white border border-gray-200 rounded-xl p-4 text-gray-700 z-50 ${isLast ? 'bottom-12' : 'top-auto'
                                  }`}
                              >
                                <div
                                  className={`absolute right-12 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent ${isLast
                                      ? '-bottom-2 border-t-8 border-t-white'
                                      : '-top-2 border-b-8 border-b-white'
                                    }`}
                                />
                                <p className="text-sm font-medium text-center">
                                  Excede <span className="text-blue-600 font-semibold">50 millones</span> y{' '}
                                  <span className="text-blue-600 font-semibold">250</span> empleados.
                                </p>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            )}
          </table>
        </div>
      )}
      <NavLink
        to='/panel/registro-pyme'
        className='text-white mt-10 py-3 text-xl rounded-md bg-[#0095d5] hover:bg-[#28a9d6] transition-colors cursor-pointer text-nowrap w-full flex justify-center items-center gap-4'
      >
        <FaPlus className='text-white ' /> Registrar Pyme
      </NavLink>
    </>
  )
}
