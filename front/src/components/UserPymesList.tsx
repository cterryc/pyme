import { useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { FaPlus } from 'react-icons/fa'
import { MdKeyboardArrowDown } from 'react-icons/md'
import type { GetPymeResponse } from '@/interfaces/pyme.interface'
import { useGetPymesByUser } from '@/hooks/usePyme'
import { PymeTableSkeleton } from './Loaders/PymeTableSkeleton'
import { toast } from 'sonner'
import { BLOCKED_STATUSES } from '@/interfaces/loan.interface'
import { FaBuilding } from "react-icons/fa";

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
    <div className='w-full px-2 sm:px-4 lg:px-0'>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-100 text-blue-600">
          <FaBuilding size={28} />
        </div>
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
            Pymes registradas
          </h2>
          <p className="text-gray-600 text-base sm:text-lg">
            Consulta el listado de pequeñas y medianas empresas registradas.
          </p>
        </div>
      </div>

      {isLoading && <PymeTableSkeleton />}
      {isError && (
        <div className='bg-red-50 border-l-4 border-red-500 p-4 rounded-md'>
          <p className='text-red-700 font-medium'>Error: {error.message}</p>
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <div className='hidden lg:block w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white'>
            <table className='min-w-full border-collapse w-full'>
              <thead className='bg-gradient-to-r from-gray-50 to-gray-100'>
                <tr className='border-b border-gray-300'>
                  {tableHeaders.map((header) => (
                    <th key={header} className='p-4 text-left'>
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
              {pymesByUser?.payload.length === 0 ? (
                <tbody>
                  <tr>
                    <td colSpan={5} className='text-center text-gray-500 py-12'>
                      <div className='flex flex-col items-center gap-3'>
                        <svg className='w-16 h-16 text-gray-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4' />
                        </svg>
                        <p className='text-lg font-medium'>No se encontraron pymes registradas.</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody className='divide-y divide-gray-200'>
                  {pymesByUser &&
                    pymesByUser.payload.map((pyme: GetPymeResponse, index) => {
                      const isLast = index === pymesByUser.payload.length - 1
                      const isBlocked = BLOCKED_STATUSES.includes(pyme.statusCredit)
                      const canRequestCredit = pyme.hasDocuments && !isBlocked

                      return (
                        <tr key={pyme.id} className='hover:bg-blue-50/50 transition-colors duration-150'>
                          <td className='p-4'>
                            <span className='font-medium text-gray-900'>{pyme.legalName}</span>
                          </td>
                          <td className='p-4'>
                            <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800'>
                              {pyme.industryName}
                            </span>
                          </td>
                          <td className='p-4'>
                            {pyme.hasDocuments ? (
                              <span className='inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold text-green-700 bg-green-100'>
                                <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                                  <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                                </svg>
                                Documentos Registrados
                              </span>
                            ) : (
                              <button
                                onClick={() => {
                                  toast.info('Completar registro de documentos', {
                                    style: { borderColor: '#0095d5', backgroundColor: '#e6f4fb', borderWidth: '2px' },
                                    description: 'Debes adjuntar y firmar los documentos para poder solicitar un crédito.',
                                    duration: 3000
                                  })
                                  navigate(`/panel/registro-documentos/${pyme.id}`)
                                }}
                                className='inline-flex items-center gap-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white px-4 py-2 text-sm font-medium transition-colors duration-200 shadow-sm hover:shadow-md'
                              >
                                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                                </svg>
                                Adjuntar Documentos
                              </button>
                            )}
                          </td>
                          <td className='p-4'>
                            {pyme.hasDocuments && (
                              <span
                                className={`inline-block px-4 py-2 rounded-full text-sm font-semibold text-center min-w-[120px]
                                  ${pyme.statusCredit === 'Enviado'
                                    ? 'bg-blue-500 text-white shadow-sm'
                                    : 'bg-gray-200 text-gray-600'
                                  }
                                `}
                              >
                                {pyme.statusCredit}
                              </span>
                            )}
                          </td>
                          <td className='p-4'>
                            <div className='flex justify-center'>
                              <div className='relative inline-block group'>
                                <button
                                  onClick={() => {
                                    if (canRequestCredit) navigate(`/panel/solicitar-credito/${pyme.id}`)
                                  }}
                                  className={`px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 text-sm min-w-[160px] shadow-sm
                                    ${canRequestCredit
                                      ? 'bg-[#0095d5] hover:bg-[#28a9d6] hover:shadow-md cursor-pointer text-white'
                                      : 'bg-gray-200 cursor-not-allowed text-gray-500 opacity-70'
                                    }
                                  `}
                                  disabled={!canRequestCredit}
                                >
                                  {statusActions(pyme.statusCredit, pyme.hasDocuments)}
                                </button>
                                {pyme.hasDocuments && pyme.statusCredit === 'No aplica' && (
                                  <div
                                    className={`absolute right-0 w-72 hidden group-hover:block bg-white border border-gray-300 rounded-xl p-4 text-gray-700 z-50 shadow-xl ${isLast ? 'bottom-14' : 'top-14'
                                      }`}
                                  >
                                    <div
                                      className={`absolute right-12 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent ${isLast
                                        ? '-bottom-2 border-t-8 border-t-white'
                                        : '-top-2 border-b-8 border-b-white'
                                        }`}
                                    />
                                    <p className='text-sm font-medium text-center leading-relaxed'>
                                      Excede <span className='text-blue-600 font-semibold'>50 millones</span> y{' '}
                                      <span className='text-blue-600 font-semibold'>250</span> empleados.
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              )}
            </table>
          </div>

          {/* Vista de tabla para móvil y tablet */}
          <div className='lg:hidden w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white'>
            <table className='min-w-[800px] border-collapse w-full'>
              <thead className='bg-gradient-to-r from-gray-50 to-gray-100'>
                <tr className='border-b border-gray-300'>
                  {tableHeaders.map((header) => (
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
              {pymesByUser?.payload.length === 0 ? (
                <tbody>
                  <tr>
                    <td colSpan={5} className='text-center text-gray-500 py-12'>
                      <div className='flex flex-col items-center gap-3'>
                        <svg className='w-12 h-12 text-gray-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4' />
                        </svg>
                        <p className='text-sm font-medium'>No se encontraron pymes registradas.</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody className='divide-y divide-gray-200'>
                  {pymesByUser &&
                    pymesByUser.payload.map((pyme: GetPymeResponse, index) => {
                      const isLast = index === pymesByUser.payload.length - 1
                      const isBlocked = BLOCKED_STATUSES.includes(pyme.statusCredit)
                      const canRequestCredit = pyme.hasDocuments && !isBlocked

                      return (
                        <tr key={pyme.id} className='hover:bg-blue-50/50 transition-colors duration-150'>
                          <td className='p-3'>
                            <span className='font-medium text-gray-900 text-sm'>{pyme.legalName}</span>
                          </td>
                          <td className='p-3'>
                            <span className='inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                              {pyme.industryName}
                            </span>
                          </td>
                          <td className='p-3'>
                            {pyme.hasDocuments ? (
                              <span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-green-700 bg-green-100 whitespace-nowrap'>
                                <svg className='w-3.5 h-3.5' fill='currentColor' viewBox='0 0 20 20'>
                                  <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                                </svg>
                                Registrados
                              </span>
                            ) : (
                              <button
                                onClick={() => {
                                  toast.info('Completar registro de documentos', {
                                    style: { borderColor: '#0095d5', backgroundColor: '#e6f4fb', borderWidth: '2px' },
                                    description: 'Debes adjuntar y firmar los documentos para poder solicitar un crédito.',
                                    duration: 3000
                                  })
                                  navigate(`/panel/registro-documentos/${pyme.id}`)
                                }}
                                className='inline-flex items-center gap-1.5 bg-gray-600 hover:bg-gray-700 rounded-lg text-white px-3 py-1.5 text-xs font-medium transition-colors duration-200 whitespace-nowrap'
                              >
                                <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                                </svg>
                                Adjuntar
                              </button>
                            )}
                          </td>
                          <td className='p-3'>
                            {pyme.hasDocuments && (
                              <span
                                className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold text-center whitespace-nowrap
                                  ${pyme.statusCredit === 'Enviado'
                                    ? 'bg-blue-500 text-white shadow-sm'
                                    : 'bg-gray-200 text-gray-600'
                                  }
                                `}
                              >
                                {pyme.statusCredit}
                              </span>
                            )}
                          </td>
                          <td className='p-3'>
                            <div className='flex justify-center'>
                              <div className='relative inline-block group'>
                                <button
                                  onClick={() => {
                                    if (canRequestCredit) navigate(`/panel/solicitar-credito/${pyme.id}`)
                                  }}
                                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all duration-200 text-xs whitespace-nowrap shadow-sm
                                    ${canRequestCredit
                                      ? 'bg-[#0095d5] hover:bg-[#28a9d6] hover:shadow-md cursor-pointer text-white'
                                      : 'bg-gray-200 cursor-not-allowed text-gray-500 opacity-70'
                                    }
                                  `}
                                  disabled={!canRequestCredit}
                                >
                                  {statusActions(pyme.statusCredit, pyme.hasDocuments)}
                                </button>
                                {pyme.hasDocuments && pyme.statusCredit === 'No aplica' && (
                                  <div
                                    className={`absolute right-0 w-60 hidden group-hover:block bg-white border border-gray-300 rounded-xl p-3 text-gray-700 z-50 shadow-xl ${isLast ? 'bottom-10' : 'top-10'
                                      }`}
                                  >
                                    <div
                                      className={`absolute right-8 w-0 h-0 border-l-6 border-l-transparent border-r-6 border-r-transparent ${isLast
                                        ? '-bottom-1.5 border-t-6 border-t-white'
                                        : '-top-1.5 border-b-6 border-b-white'
                                        }`}
                                    />
                                    <p className='text-xs font-medium text-center leading-relaxed'>
                                      Excede <span className='text-blue-600 font-semibold'>50 millones</span> y{' '}
                                      <span className='text-blue-600 font-semibold'>250</span> empleados.
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
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

      <NavLink
        to='/panel/registro-pyme'
        className='text-white mt-8 sm:mt-10 py-3 sm:py-4 text-base sm:text-lg lg:text-xl rounded-xl bg-[#0095d5] hover:bg-[#28a9d6] transition-all duration-200 cursor-pointer w-full flex justify-center items-center gap-3 font-semibold shadow-md hover:shadow-lg'
      >
        <FaPlus className='text-white w-4 h-4 sm:w-5 sm:h-5' />
        <span>Registrar Pyme</span>
      </NavLink>
    </div>
  )
}
