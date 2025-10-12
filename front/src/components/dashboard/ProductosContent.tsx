import { SearchBar } from '../SearchBar'
import { FilterDropdown } from '../FilterDropdown'
import { DataTable } from '../DataTable'
import { useDashboard } from '../../context/DashboardContext'

export const ProductosContent = () => {
  const {
    searchTerm,
    setSearchTerm,
    estadoFilter,
    setEstadoFilter,
    products,
    getFilteredProducts,
    formatCurrency
  } = useDashboard()

  // Configuración de columnas para la tabla de productos
  const tableColumns = [
    { key: 'nombre', label: 'PRODUCTO', width: '25%' },
    { key: 'tipo', label: 'TIPO', width: '15%' },
    { 
      key: 'tasaInteres', 
      label: 'TASA INTERÉS', 
      width: '10%',
      render: (value: number) => `${value}%`
    },
    { 
      key: 'montoMinimo', 
      label: 'MONTO MÍNIMO', 
      width: '15%',
      render: (value: number) => formatCurrency(value)
    },
    { 
      key: 'montoMaximo', 
      label: 'MONTO MÁXIMO', 
      width: '15%',
      render: (value: number) => formatCurrency(value)
    },
    { 
      key: 'plazoMaximo', 
      label: 'PLAZO MÁX', 
      width: '10%',
      render: (value: number) => `${value} meses`
    },
    { key: 'estado', label: 'ESTADO', width: '10%' }
  ]

  const filteredData = getFilteredProducts()

  return (
    <div className="flex-1 bg-white">
      {/* Header del contenido */}
      <div className="px-8 py-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Productos</h1>
        <p className="text-gray-600 text-sm mt-1">Administra los productos financieros disponibles para PyMEs</p>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="px-8 py-6 border-b border-gray-200">
        <div className="flex flex-wrap items-center gap-4">
          <SearchBar
            placeholder="Buscar por nombre de producto o tipo"
            value={searchTerm}
            onChange={setSearchTerm}
          />
          
          <div className="flex items-center gap-4">
            <FilterDropdown
              value={estadoFilter}
              options={['Todos', 'Activo', 'Inactivo']}
              onChange={setEstadoFilter}
            />
            
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              Nuevo Producto
            </button>
          </div>
        </div>
      </div>

      {/* Estadísticas de productos */}
      <div className="px-8 py-4 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">📦</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-800">Total Productos</p>
                <p className="text-lg font-bold text-blue-900">{products.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">Activos</p>
                <p className="text-lg font-bold text-green-900">
                  {products.filter(product => product.estado === 'Activo').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">📊</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-yellow-800">Tasa Promedio</p>
                <p className="text-lg font-bold text-yellow-900">
                  {(products.reduce((acc, p) => acc + p.tasaInteres, 0) / products.length).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">💰</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-800">Monto Máximo</p>
                <p className="text-lg font-bold text-purple-900">
                  {formatCurrency(Math.max(...products.map(p => p.montoMaximo)))}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de datos */}
      <div className="px-8 py-6">
        <DataTable
          columns={tableColumns}
          data={filteredData}
          onRowClick={(row) => console.log('Clicked product:', row)}
        />
        
        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-5xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
            <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  )
}