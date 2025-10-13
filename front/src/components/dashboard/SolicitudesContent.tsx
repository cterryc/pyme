import { SearchBar } from '../SearchBar'
import { FilterDropdown } from '../FilterDropdown'
import { DataTable } from '../DataTable'
import { useDashboard } from '../../context/DashboardContext'

export const SolicitudesContent = () => {
  const {
    searchTerm,
    setSearchTerm,
    estadoFilter,
    setEstadoFilter,
    fechaFilter,
    setFechaFilter,
    montoFilter,
    setMontoFilter,
    getFilteredApplications
  } = useDashboard()

  // Configuración de columnas para la tabla
  const tableColumns = [
    { key: 'empresa', label: 'EMPRESA', width: '20%' },
    { key: 'solicitante', label: 'SOLICITANTE', width: '20%' },
    { key: 'fechaSolicitud', label: 'FECHA DE SOLICITUD', width: '20%' },
    { key: 'monto', label: 'MONTO', width: '15%' },
    { key: 'estado', label: 'ESTADO', width: '15%' },
    { 
      key: 'acciones', 
      label: 'ACCIONES', 
      width: '10%',
      render: () => (
        <button className="text-blue-600 hover:text-blue-800 font-medium">
          Ver
        </button>
      )
    }
  ]

  const filteredData = getFilteredApplications()

  return (
    <div className="flex-1 bg-white">
      {/* Header del contenido */}
      <div className="px-8 py-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Solicitudes de Crédito</h1>
        <p className="text-gray-600 text-sm mt-1">Gestiona y revisa las solicitudes de crédito de las PYMES</p>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="px-8 py-6 border-b border-gray-200">
        <div className="flex flex-wrap items-center gap-4">
          <SearchBar
            placeholder="Buscar por nombre de empresa"
            value={searchTerm}
            onChange={setSearchTerm}
          />
          
          <div className="flex items-center gap-4">
            <FilterDropdown
              value={estadoFilter}
              options={['Todos', 'Pendiente', 'Aprobado', 'Rechazado']}
              onChange={setEstadoFilter}
            />
            
            <FilterDropdown
              value={fechaFilter}
              options={['Reciente', 'Antigua', 'Esta semana', 'Este mes']}
              onChange={setFechaFilter}
            />
            
            <FilterDropdown
              value={montoFilter}
              options={['Todos', 'Menor a $50K', '$50K - $100K', 'Mayor a $100K']}
              onChange={setMontoFilter}
            />
          </div>
        </div>
      </div>

      {/* Tabla de datos */}
      <div className="px-8 py-6">
        <DataTable
          columns={tableColumns}
          data={filteredData}
          onRowClick={(row) => console.log('Clicked row:', row)}
        />
      </div>
    </div>
  )
}