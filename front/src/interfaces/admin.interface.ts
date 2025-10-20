// ==================== TIPOS DE ESTADO ====================
export type CreditApplicationStatus =
  | "No iniciado"
  | "No confirmado"
  | "Enviado"
  | "En revisión"
  | "Documentos requeridos"
  | "Aprobado"
  | "Rechazado"
  | "Desembolsado"
  | "Cancelado";

// ==================== RESPUESTAS DE LA API ====================

export interface CreditApplicationListItem {
  id: string;
  applicationNumber: string;
  status: CreditApplicationStatus;
  selectedAmount: number | null;
  selectedTermMonths: number | null;
  approvedAmount: number | null;
  riskScore: number | null;
  submittedAt: string | null;
  createdAt: string;
  updatedAt: string;
  company: {
    id: string;
    legalName: string;
    taxId: string;
    email: string | null;
    industry: string | null;
  };
  owner: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
  documentsCount: number;
  pendingDocumentsCount: number;
}

export interface CreditApplicationDetail {
  id: string;
  applicationNumber: string;
  status: CreditApplicationStatus;
  offerDetails: {
    minAmount: number;
    maxAmount: number;
    interestRate: number;
    allowedTerms: number[];
  } | null;
  selectedAmount: number | null;
  selectedTermMonths: number | null;
  approvedAmount: number | null;
  rejectionReason: string | null;
  internalNotes: string | null;
  riskScore: number | null;
  submittedAt: string | null;
  reviewedAt: string | null;
  approvedAt: string | null;
  disbursedAt: string | null;
  createdAt: string;
  updatedAt: string;
  statusHistory: Array<{
    status: CreditApplicationStatus;
    timestamp: string;
    changedBy: string | null;
    reason: string | null;
  }>;
  company: {
    id: string;
    legalName: string;
    tradeName: string | null;
    taxId: string;
    email: string | null;
    phone: string | null;
    foundedDate: string | null;
    employeeCount: number | null;
    annualRevenue: number | null;
    address: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    website: string | null;
    description: string | null;
    industry: {
      id: string;
      name: string;
      baseRiskTier: string;
    } | null;
  };
  owner: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
  };
  documents: Array<{
    id: string;
    type: string;
    fileName: string;
    fileUrl: string;
    status: string;
    mimeType: string | null;
    fileSize: number | null;
    rejectionReason: string | null;
    uploadedAt: string;
    reviewedAt: string | null;
  }>;
  reviewedBy: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  } | null;
}

export interface PaginatedCreditApplications {
  data: CreditApplicationListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ListCreditApplicationsResponse {
  success: boolean;
  payload: PaginatedCreditApplications;
}

export interface CreditApplicationDetailResponse {
  success: boolean;
  payload: CreditApplicationDetail;
}

// ==================== PARÁMETROS DE BÚSQUEDA ====================

export interface ListCreditApplicationsParams {
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "submittedAt" | "selectedAmount" | "status";
  sortOrder?: "ASC" | "DESC";
  status?: CreditApplicationStatus;
  companyId?: string;
  applicationNumber?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
}

// ==================== REQUEST BODY ====================

export interface UpdateCreditApplicationStatusRequest {
  status: CreditApplicationStatus;
  reason?: string;
  internalNotes?: string;
  approvedAmount?: number;
  riskScore?: number;
}
