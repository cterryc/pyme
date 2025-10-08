import { SearchBar } from '../SearchBar'
import { FilterDropdown } from '../FilterDropdown'
import { DataTable } from '../DataTable'
import { useDashboard } from '../../context/DashboardContext'

export const MypesContent = () => {
    const {
        searchTerm,
        setSearchTerm,
        estadoFilter,
        setEstadoFilter,
        clients,
        getFilteredClients
    } = useDashboard()

    // Configuración de columnas para la tabla de clientes
    const tableColumns = [
        { key: 'nombre', label: 'NOMBRE', width: '20%' },
        { key: 'email', label: 'EMAIL', width: '25%' },
        { key: 'telefono', label: 'TELÉFONO', width: '15%' },
        { key: 'empresa', label: 'EMPRESA', width: '20%' },
        { key: 'fechaRegistro', label: 'FECHA REGISTRO', width: '15%' },
        { key: 'estado', label: 'ESTADO', width: '5%' },
        {
            key: 'acciones',
            label: 'ACCIONES',
            width: '10%',
            render: () => (
                <button className="text-blue-600 hover:text-blue-800 font-medium">
                    Opciones
                </button>
            )
        }
    ]

    const filteredData = getFilteredClients()

    return (
        <div className="flex-1 bg-white">
            {/* Header del contenido */}
            <div className="px-8 py-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Clientes</h1>
                <p className="text-gray-600 text-sm mt-1">Administra y consulta la información de tus clientes PyME</p>
            </div>

            {/* Barra de búsqueda y filtros */}
            <div className="px-8 py-6 border-b border-gray-200">
                <div className="flex flex-wrap items-center gap-4">
                    <SearchBar
                        placeholder="Buscar por nombre, email o empresa"
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
                            Nuevo Cliente
                        </button>
                    </div>
                </div>
            </div>

            {/* Estadísticas de clientes */}
            <div className="px-8 py-4 border-b border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">👥</span>
                                </div>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-blue-800">Total Clientes</p>
                                <p className="text-lg font-bold text-blue-900">{clients.length}</p>
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
                                    {clients.filter(client => client.estado === 'Activo').length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">⏸</span>
                                </div>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-800">Inactivos</p>
                                <p className="text-lg font-bold text-gray-900">
                                    {clients.filter(client => client.estado === 'Inactivo').length}
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
                    onRowClick={(row) => console.log('Clicked client:', row)}
                />

                {filteredData.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-5xl mb-4">👥</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron clientes</h3>
                        <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
                    </div>
                )}
            </div>
        </div>
    )
}