import { SearchBar } from '../SearchBar'
import { DataTable } from '../DataTable'
import { Select } from '../Select'
import { useDashboard } from '../../hooks/Admin/useDashboard'
import { Paginator } from '../Paginator'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Modal } from '../Modals/Modal'
import type { RegisterPymeFormData } from '@/schemas/pyme.schema'
import { PymeForm } from '../pymeForm'
type Actions = 'NOTHING' | 'VIEW' | 'EDIT'

interface PymeData extends RegisterPymeFormData {
  industryName: string
}

export const MypesContent = () => {
  const [action, setAction] = useState<Actions>('NOTHING')
  const [selectedPymeData, setSelectedPymeData] = useState<PymeData>()
  const [enableModa, setEnableModal] = useState(false)
  const {
    searchTerm,
    setSearchTerm,
    // estadoFilter,
    // setEstadoFilter,
    // clients,
    getFilteredClients,
    industryFilter,
    setIndustryFilter,
    isLoading,
    totalClients,
    totalPages,
    industryList,
    setCurrentPage,
    errors
  } = useDashboard()

  //Configuración de columnas para la tabla de clientes
  // const tableColumns = [
  //   { key: 'nombre', label: 'NOMBRE', width: '20%' },
  //   { key: 'email', label: 'EMAIL', width: '25%' },
  //   { key: 'telefono', label: 'TELÉFONO', width: '15%' },
  //   { key: 'empresa', label: 'EMPRESA', width: '20%' },
  //   { key: 'fechaRegistro', label: 'FECHA REGISTRO', width: '15%' },
  //   { key: 'estado', label: 'ESTADO', width: '5%' },
  //   {
  //     key: 'acciones',
  //     label: 'ACCIONES',
  //     width: '10%',
  //     render: (_value: any, row: any) => (
  //       <Select
  //         options={[
  //           { value: 'ver', label: 'Ver', icon: '👁️' },
  //           { value: 'editar', label: 'Editar', icon: '✏️' }
  //         ]}
  //         placeholder='Opciones'
  //         variant='button'
  //         size='sm'
  //         onSelect={(option) => {
  //           console.log(`Acción seleccionada: ${option.value} para cliente:`, row)
  //           if (option.value === 'ver') {
  //             console.log('Ver cliente:', row.nombre)
  //           } else if (option.value === 'editar') {
  //             console.log('Editar cliente:', row.nombre)
  //           }
  //         }}
  //       />
  //     )
  //   }
  // ]

  const tableColumns = [
    { key: 'legalName', label: 'NOMBRE LEGAL', width: '20%' },
    { key: 'email', label: 'EMAIL', width: '25%' },
    { key: 'phone', label: 'TELÉFONO', width: '10%' },
    { key: 'industryName', label: 'EMPRESA', width: '20%', align: 'center' },
    { key: 'createdAt', label: 'FECHA REGISTRO', width: '10%', align: 'center' },
    { key: 'statusCredit', label: 'ESTADO DE CREDITO', width: '5%', align: 'center' },
    {
      key: 'acciones',
      label: 'ACCIONES',
      width: '15%',
      render: (_value: any, row: any) => (
        // <Select
        //   options={[
        //     { value: 'ver', label: 'Ver', icon: '👁️' },
        //     { value: 'editar', label: 'Editar', icon: '✏️' }
        //   ]}
        //   placeholder='Opciones'
        //   variant='button'
        //   size='sm'
        //   onSelect={(option) => {
        //     // console.log(`Acción seleccionada: ${option.value} para cliente:`, row)
        //     if (option.value === 'ver') {
        //       // console.log('Ver cliente:', row.nombre)
        //       setSelectedPymeData(row)
        //       setAction('VIEW')
        //     } else if (option.value === 'editar') {
        //       // console.log('Editar cliente:', row.nombre)
        //       setAction('EDIT')
        //       setSelectedPymeData(row)
        //     }
        //   }}
        // />
        <div className='flex justify-between w-full text-xl'>
          <button
            onClick={() => {
              setAction('VIEW')
            }}
          >
            👁️
          </button>
          <button
            onClick={() => {
              setAction('EDIT')
            }}
          >
            ✏️
          </button>
        </div>
      )
    }
  ]

  const filteredData = getFilteredClients()

  useEffect(() => {
    errors.forEach((errorMessage) =>
      toast.error('Error', {
        style: { borderColor: '#fa4545ff', backgroundColor: '#fff1f1ff', borderWidth: '2px' },
        description: errorMessage,
        duration: 4000
      })
    )
  }, [errors])

  return (
    <div className='flex-1 bg-white'>
      {/* Header del contenido */}
      <div className='px-8 py-6 border-b border-gray-200'>
        <h1 className='text-2xl font-bold text-gray-900'>Gestión de Clientes</h1>
        <p className='text-gray-600 text-sm mt-1'>Administra y consulta la información de tus clientes PyME</p>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className='px-8 py-6 border-b border-gray-200'>
        <div className='flex flex-wrap items-center gap-4'>
          <SearchBar placeholder='Buscar por nombre de empresa' value={searchTerm} onChange={setSearchTerm} />

          <div className='flex items-center gap-4'>
            <div className='relative'>
              <select
                value={industryFilter}
                onChange={(e) => {
                  setIndustryFilter(e.target.value)
                }}
                className='appearance-none bg-white border border-gray-300 rounded-md py-2 px-4 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              >
                <option value=''>Filtrar por industria</option>
                {industryList.map((pair) => (
                  <option key={pair.id} value={pair.id}>
                    {pair.name}
                  </option>
                ))}
              </select>
              <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
                <svg className='fill-current h-4 w-4' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
                  <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas de clientes */}
      <div className='px-8 py-4 border-b border-gray-200'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='bg-blue-50 p-4 rounded-lg'>
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <div className='w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center'>
                  <span className='text-white text-xs font-bold'>👥</span>
                </div>
              </div>
              <div className='ml-3'>
                <p className='text-sm font-medium text-blue-800'>Total Clientes</p>
                <p className='text-lg font-bold text-blue-900'>{totalClients}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de datos */}
      <div className='px-8 py-6'>
        {/* {!isLoading ? ( 
        <div>*/}
        <DataTable
          columns={tableColumns}
          data={filteredData}
          // onRowClick={(row) => console.log('Clicked client:', row)}
          onRowClick={(row) => {
            setSelectedPymeData(row)
            setEnableModal(true)
          }}
          isLoading={isLoading}
        />
        {/*</div>
         ) : (
          //   <div className='flex flex-col min-h-[20vh] justify-center '>
          <Loading dark={true} />
          //   </div>
        )} */}

        <Paginator totalPages={totalPages} disable={isLoading} onPagChange={setCurrentPage} />

        {!isLoading && filteredData && filteredData.length === 0 && (
          <div className='text-center py-12'>
            <div className='text-gray-400 text-5xl mb-4'>👥</div>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>No se encontraron clientes</h3>
            <p className='text-gray-500'>Intenta ajustar los filtros de búsqueda</p>
          </div>
        )}
      </div>
      {
        <Modal
          enable={action == 'VIEW' && enableModa}
          onClose={() => {
            setEnableModal(false)
          }}
        >
          <div className='bg-white grid grid-cols-2 gap-7 p-10 rounded-md text-xl'>
            <h3 className='text-[var(--font-title-light)] font-medium text-3xl col-span-2 mb-5'>Detalles de la pyme</h3>
            <p className='col-span-1 font-medium'>
              Ingresos anuales:<span className='font-normal'>{selectedPymeData?.annualRevenue || ''}</span>
            </p>
            <p className='col-span-1 font-medium'>
              Ciudad:<span className='font-normal'>{selectedPymeData?.city || ''}</span>
            </p>
            <p className='col-span-1 font-medium'>
              País:<span className='font-normal'>{selectedPymeData?.country || ''}</span>
            </p>
            <p className='col-span-1 font-medium'>
              Email empresarial:<span className='font-normal'>{selectedPymeData?.email || ''}</span>
            </p>
            <p className='col-span-1 font-medium'>
              Cantidad de empleados:<span className='font-normal'>{selectedPymeData?.employeeCount || ''}</span>
            </p>
            <p className='col-span-1 font-medium'>
              CUIT:<span className='font-normal'>{selectedPymeData?.taxId || ''}</span>
            </p>
            <p className='col-span-1 font-medium'>
              Fecha de fundación:
              <span className='font-normal'>
                {new Date(selectedPymeData?.foundedDate || '01-01-2005').toISOString().substring(0, 10) || ''}
              </span>
            </p>
            <p className='col-span-1 font-medium'>
              Industria: <span className='font-normal'>{selectedPymeData?.industryName || ''}</span>
            </p>
            <p className='col-span-1 font-medium'>
              Nombre legal: <span className='font-normal'>{selectedPymeData?.legalName || ''}</span>
            </p>
            <p className='col-span-1 font-medium'>
              Telefono: <span className='font-normal'>{selectedPymeData?.phone || ''}</span>
            </p>
            <p className='col-span-1 font-medium'>
              Estado/Provincia: <span className='font-normal'>{selectedPymeData?.state || ''}</span>
            </p>
            <p className='col-span-1 font-medium'>
              Nombre comercial: <span className='font-normal'>{selectedPymeData?.tradeName || ''}</span>
            </p>
          </div>
        </Modal>
      }
      {
        <Modal enable={action == 'EDIT' && enableModa} onClose={() => setEnableModal(false)}>
          <div className='max-h-[90vh] px-5 py-15 overflow-y-scroll bg-white rounded-md w-6xl text-black'>
            <h3 className='text-3xl text-center font-medium text-[var(--font-title-light)]'>Editar pyme</h3>
            <PymeForm
              industriesList={industryList}
              defaultValues={selectedPymeData}
              onCancel={() => setEnableModal(false)}
            />
          </div>
        </Modal>
      }
    </div>
  )
}
