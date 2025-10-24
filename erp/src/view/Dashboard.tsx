export default function DashboardView() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total PyMEs</h3>
          <p className="text-3xl font-bold text-blue-600">145</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Solicitudes Activas</h3>
          <p className="text-3xl font-bold text-green-600">23</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Planes Activos</h3>
          <p className="text-3xl font-bold text-purple-600">8</p>
        </div>
      </div>
    </div>
  );
}
