import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { FaUser, FaBuilding } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useGetPymesByUser } from '@/hooks/usePyme';
import type { GetPymeResponse } from '@/interfaces/pyme.interface';
import { PymeTableSkeleton } from '@/components/Loaders/PymeTableSkeleton';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const UserDashboard = () => {
  const navigate = useNavigate()

  const { data: pymesByUser, isLoading, isError, error, refetch } = useGetPymesByUser();
  const tableHeaders = ['Nombre Legal', 'Dueño', 'Sector', 'Documentos', 'Solicitud de credito']

  // temporal
  useEffect(() => {
    refetch()
  }, [refetch])

  return (
    <section className='flex flex-col min-h-screen'>
      <Header />
      <section className='flex flex-1'>
        <aside className='flex flex-col gap-1 flex-1 py-5 px-3 border-r-2 border-gray-200'>
          <div className='group flex items-center gap-2 text-xl p-2 rounded-lg hover:bg-[#28a9d622] cursor-pointer text-gray-400 hover:text-[#23a9d6]'>
            <FaUser className='h-6 w-6 text-gray-400 group-hover:text-[#23a9d6]' />
            Perfil
          </div>
          <div className='group flex items-center gap-2 text-xl p-2 rounded-lg hover:bg-[#28a9d622] cursor-pointer text-gray-400 hover:text-[#23a9d6]'>
            <FaBuilding className='h-6 w-6 text-gray-400 group-hover:text-[#23a9d6]' />
            Pymes
          </div>
        </aside>
        <div className="flex-[6] min-w-0 p-7 overflow-x-auto">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Lista de Pymes registradas</h2>
          {isLoading && <PymeTableSkeleton />}
          {isError && <p>Error: {error.message}</p>}
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
                    <th className="p-3 text-center !w-[150px]">Acciones</th>
                  </tr>
                </thead>
                {pymesByUser?.payload.length === 0 ? (
                  <tbody>
                    <tr>
                      <td colSpan={6} className="text-center text-gray-500 py-6">
                        No se encontraron pymes registradas.
                      </td>
                    </tr>
                  </tbody>
                ) : (
                  <tbody>
                    {pymesByUser && pymesByUser.payload.map((pyme: GetPymeResponse) => {
                      const NotCredit =
                        pyme.statusCredit === 'Activo' && pyme.hasDocuments ||
                        pyme.statusCredit !== 'Activo' && !pyme.hasDocuments
                      const hasFullName = pyme.ownerName && pyme.ownerSurname
                      return (
                        <tr
                          key={pyme.id}
                          className="hover:bg-gray-100 cursor-pointer border-b-2 border-gray-200"
                        >
                          <td className="p-3">{pyme.legalName}</td>
                          <td className="p-3">
                            {hasFullName
                              ? `${pyme.ownerName} ${pyme.ownerSurname}`
                              : 'Sin nombre'}
                          </td>
                          <td className="p-3">{pyme.industry}</td>
                          <td className="p-3">
                            {
                              pyme.hasDocuments
                                ? (
                                  <span className='py-2 rounded-full text-[#12b92f] font-bold'>
                                    Documentos Registrados
                                  </span>
                                )
                                : (
                                  <span
                                    onClick={()=>navigate(`/Dashboard/RegistroDocumentosPyme/${pyme.id}`)}
                                    className='bg-gray-500 hover:bg-gray-400 rounded-md text-white px-4 py-2'
                                  >
                                    Adjuntar Documentos
                                  </span>
                                )
                            }
                          </td>
                          <td className="p-3">
                            <span className={`rounded-full px-6 py-2 text-gray-700
                          ${pyme.statusCredit === 'Activo' ? 'bg-green-400 text-white' : 'bg-gray-200 text-gray-500'}
                        `}
                            >
                              {pyme.statusCredit}
                            </span>
                          </td>
                          <td className="p-3 flex gap-3">
                            <button className="bg-[#0095d5] text-white px-4 py-2 rounded-md hover:bg-[#28a9d6] transition-colors cursor-pointer text-nowrap">
                              Editar Pyme
                            </button>
                            <button className={`px-4 py-2 rounded-md transition-colorsr text-nowrap font-semibold
                          ${NotCredit
                                ? 'bg-gray-200 cursor-default text-gray-400 select-none'
                                : 'bg-[#5CCEFF] hover:bg-[#7DDCFF] cursor-pointer text-white'}  
                          `}
                            >
                              Solicitar credito
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                )}
              </table>
            </div>
          )}
          <button
            onClick={() => navigate('/Dashboard/RegistroPyme')}
            className="text-white mt-10 py-3 text-xl rounded-md bg-[#0095d5] hover:bg-[#28a9d6] transition-colors cursor-pointer text-nowrap w-full flex justify-center items-center gap-4"
          >
            <FaPlus className='text-white ' /> Registrar Pyme
          </button>
        </div>
      </section>
      <Footer />
    </section>
  )
}
