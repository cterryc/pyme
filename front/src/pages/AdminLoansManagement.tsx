import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LoanFilters } from "@/components/Admin/LoanFilters";
import { LoansTable } from "@/components/Admin/LoansTable";
import { Pagination } from "@/components/Admin/Pagination";
import { LoanDetailModal } from "@/components/Admin/LoanDetailModal";
import {
  useListCreditApplications,
  useGetCreditApplicationDetail,
  useUpdateCreditApplicationStatus,
} from "@/hooks/Admin/useAdminLoans";
import type { ListCreditApplicationsParams } from "@/interfaces/admin.interface";
import { toast } from "sonner";

export function AdminLoansManagement() {
  const [filters, setFilters] = useState<ListCreditApplicationsParams>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "DESC",
  });

  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);

  // Queries
  const { data: loansData, isLoading: isLoadingList, error } = useListCreditApplications(filters);
  const { data: loanDetailData, isLoading: isLoadingDetail } = useGetCreditApplicationDetail(
    selectedLoanId
  );

  // Log para debug
  console.log('[AdminLoansManagement] State:', {
    selectedLoanId,
    isLoadingDetail,
    hasLoanDetailData: !!loanDetailData,
    loanDetailPayload: loanDetailData?.payload
  });

  // Mutation
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateCreditApplicationStatus({
    onSuccess: (data) => {
      toast.success(`Estado actualizado a: ${data.payload.status}`);
      setSelectedLoanId(null); // Cerrar modal
    },
    onError: (error: any) => {
      toast.error(error?.payload?.message || "Error al actualizar el estado");
    },
  });

  const handleFilterChange = (newFilters: ListCreditApplicationsParams) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleViewDetail = (id: string) => {
    console.log('[AdminLoansManagement] Ver detalle de:', id);
    setSelectedLoanId(id);
  };

  const handleCloseModal = () => {
    console.log('[AdminLoansManagement] Cerrando modal');
    setSelectedLoanId(null);
  };

  const handleUpdateStatus = (id: string, data: any) => {
    updateStatus({ id, data });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Gestión de Solicitudes de Crédito
          </h1>
          <p className="text-gray-600 mt-2">
            Administra y revisa todas las solicitudes de crédito
          </p>
        </div>

        {/* Estadísticas rápidas */}
        {loansData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-sm font-medium text-gray-500">Total de Solicitudes</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {loansData.payload.pagination.total}
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg shadow-md">
              <h3 className="text-sm font-medium text-blue-700">En Esta Página</h3>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                {loansData.payload.data.length}
              </p>
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg shadow-md">
              <h3 className="text-sm font-medium text-yellow-700">Página Actual</h3>
              <p className="text-3xl font-bold text-yellow-900 mt-2">
                {loansData.payload.pagination.page} / {loansData.payload.pagination.totalPages}
              </p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg shadow-md">
              <h3 className="text-sm font-medium text-green-700">Límite por Página</h3>
              <p className="text-3xl font-bold text-green-900 mt-2">
                {loansData.payload.pagination.limit}
              </p>
            </div>
          </div>
        )}

        {/* Filtros */}
        <LoanFilters onFilterChange={handleFilterChange} currentFilters={filters} />

        {/* Tabla de solicitudes */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            <p className="font-medium">Error al cargar las solicitudes</p>
            <p className="text-sm mt-1">{(error as any)?.payload?.message || "Error desconocido"}</p>
          </div>
        )}

        {loansData && (
          <>
            <LoansTable
              loans={loansData.payload.data}
              onViewDetail={handleViewDetail}
              isLoading={isLoadingList}
            />

            {/* Paginación */}
            {loansData.payload.pagination.totalPages > 1 && (
              <Pagination
                currentPage={loansData.payload.pagination.page}
                totalPages={loansData.payload.pagination.totalPages}
                onPageChange={handlePageChange}
                total={loansData.payload.pagination.total}
                limit={loansData.payload.pagination.limit}
              />
            )}
          </>
        )}

        {isLoadingList && !loansData && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Cargando solicitudes...</p>
          </div>
        )}
      </main>

      <Footer />

      {/* Modal de detalle */}
      {selectedLoanId && !isLoadingDetail && loanDetailData?.payload && (
        <LoanDetailModal
          loan={loanDetailData.payload}
          isOpen={true}
          onClose={handleCloseModal}
          onUpdateStatus={handleUpdateStatus}
          isUpdating={isUpdating}
        />
      )}

      {/* Loading overlay para el modal */}
      {isLoadingDetail && selectedLoanId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Cargando detalle...</p>
          </div>
        </div>
      )}
    </div>
  );
}
