import { useState } from "react";
import type { ListCreditApplicationsParams, CreditApplicationStatus } from "@/interfaces/admin.interface";

interface LoanFiltersProps {
  onFilterChange: (filters: ListCreditApplicationsParams) => void;
  currentFilters: ListCreditApplicationsParams;
}

const STATUS_OPTIONS: CreditApplicationStatus[] = [
  "Enviado",
  "En revisión",
  "Documentos requeridos",
  "Aprobado",
  "Rechazado",
  "Desembolsado",
  "Cancelado",
];

export function LoanFilters({ onFilterChange, currentFilters }: LoanFiltersProps) {
  const [search, setSearch] = useState(currentFilters.search || "");
  const [status, setStatus] = useState<CreditApplicationStatus | "">(currentFilters.status || "");
  const [minAmount, setMinAmount] = useState(currentFilters.minAmount?.toString() || "");
  const [maxAmount, setMaxAmount] = useState(currentFilters.maxAmount?.toString() || "");

  const handleApplyFilters = () => {
    onFilterChange({
      ...currentFilters,
      search: search || undefined,
      status: status || undefined,
      minAmount: minAmount ? Number(minAmount) : undefined,
      maxAmount: maxAmount ? Number(maxAmount) : undefined,
      page: 1, // Reset a la primera página
    });
  };

  const handleClearFilters = () => {
    setSearch("");
    setStatus("");
    setMinAmount("");
    setMaxAmount("");
    onFilterChange({
      page: 1,
      limit: currentFilters.limit || 10,
      sortBy: "createdAt",
      sortOrder: "DESC",
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">Filtros de Búsqueda</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Búsqueda general */}
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Búsqueda General
          </label>
          <input
            type="text"
            placeholder="Empresa, email, número de solicitud..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Estado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as CreditApplicationStatus | "")}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos los estados</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Monto mínimo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monto Mínimo
          </label>
          <input
            type="number"
            placeholder="0"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Monto máximo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monto Máximo
          </label>
          <input
            type="number"
            placeholder="Sin límite"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={handleApplyFilters}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          Aplicar Filtros
        </button>
        <button
          onClick={handleClearFilters}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
        >
          Limpiar Filtros
        </button>
      </div>
    </div>
  );
}
