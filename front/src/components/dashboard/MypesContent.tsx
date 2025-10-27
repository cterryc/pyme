import { SearchBar } from '../SearchBar'
// import { FilterDropdown } from '../FilterDropdown'
import { DataTable } from '../DataTable'
import { Select } from '../Select'
// import { useDashboard } from '../../context/DashboardContext'
import { useDashboard } from '../../hooks/Admin/useDashboard'
import { Loading } from '../Loading'
import { Paginator } from '../Paginator'
import { useEffect } from 'react'
import { toast } from 'sonner'

export const MypesContent = () => {
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
    { key: 'phone', label: 'TELÉFONO', width: '15%' },
    { key: 'industryName', label: 'EMPRESA', width: '20%', align: 'center' },
    { key: 'createdAt', label: 'FECHA REGISTRO', width: '15%', align: 'center' },
    { key: 'statusCredit', label: 'ESTADO DE CREDITO', width: '5%', align: 'center' },
    {
      key: 'acciones',
      label: 'ACCIONES',
      width: '10%',
      render: (_value: any, row: any) => (
        <Select
          options={[
            { value: 'ver', label: 'Ver', icon: '👁️' },
            { value: 'editar', label: 'Editar', icon: '✏️' }
          ]}
          placeholder='Opciones'
          variant='button'
          size='sm'
          onSelect={(option) => {
            console.log(`Acción seleccionada: ${option.value} para cliente:`, row)
            if (option.value === 'ver') {
              console.log('Ver cliente:', row.nombre)
            } else if (option.value === 'editar') {
              console.log('Editar cliente:', row.nombre)
            }
          }}
        />
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
            {/* <FilterDropdown value={estadoFilter} options={['Todos', 'Activo', 'Inactivo']} onChange={setEstadoFilter} /> */}

            {/* { FILTER DROW DOWN TUNEADO} */}
            {/* { FILTER DROW DOWN TUNEADO} */}
            <div className='relative'>
              <select
                // onChange={(e) => console.log(e.target.value)}
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
            {/* { FILTER DROW DOWN TUNEADO} */}
            {/* { FILTER DROW DOWN TUNEADO} */}

            {/* <button className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors'>
              Nuevo Cliente
            </button> */}
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

          {/*<div className='bg-green-50 p-4 rounded-lg'>
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <div className='w-6 h-6 bg-green-500 rounded-full flex items-center justify-center'>
                  <span className='text-white text-xs font-bold'>✓</span>
                </div>
              </div>
              <div className='ml-3'>
                <p className='text-sm font-medium text-green-800'>Activos</p>
                <p className='text-lg font-bold text-green-900'>
                  {// {clients.filter((client) => client.estado === 'Activo').length} }
                  0000
                </p>
              </div>
            </div>
          </div>

          <div className='bg-gray-50 p-4 rounded-lg'>
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <div className='w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center'>
                  <span className='text-white text-xs font-bold'>⏸</span>
                </div>
              </div>
              <div className='ml-3'>
                <p className='text-sm font-medium text-gray-800'>Inactivos</p>
                <p className='text-lg font-bold text-gray-900'>
                  000
                  {//{clients.filter((client) => client.estado === 'Inactivo').length}}
                </p>
              </div>
            </div>
          </div>*/}
        </div>
      </div>

      {/* Tabla de datos */}
      <div className='px-8 py-6'>
        {/* {!isLoading ? ( 
        <div>*/}
        <DataTable
          columns={tableColumns}
          data={filteredData}
          onRowClick={(row) => console.log('Clicked client:', row)}
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
    </div>
  )
}
