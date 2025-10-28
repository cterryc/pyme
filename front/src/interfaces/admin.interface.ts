// Interfaces para el módulo de administración

export interface SystemConfig {
  id: string;
  key: string;
  value: number;
  description?: string;
}

export interface RiskTierConfig {
  id: string;
  tier: 'A' | 'B' | 'C' | 'D';
  spread: number;
  factor: number;
  allowed_terms: number[];
}

export interface Industry {
  id: string;
  name: string;
  baseRiskTier: 'A' | 'B' | 'C' | 'D';
  description?: string;
}

// Interfaces para las respuestas de la API
export interface SystemConfigResponse {
  success: boolean;
  payload: SystemConfig[];
}

export interface RiskTierConfigResponse {
  success: boolean;
  payload: RiskTierConfig[];
}

export interface IndustryResponse {
  success: boolean;
  payload: Industry[];
}

export interface SingleSystemConfigResponse {
  success: boolean;
  payload: SystemConfig;
}

export interface SingleRiskTierConfigResponse {
  success: boolean;
  payload: RiskTierConfig;
}

export interface SingleIndustryResponse {
  success: boolean;
  payload: Industry;
}

export interface DeleteResponse {
  success: boolean;
  payload: { message: string };
}

// Interfaces para crear/actualizar
export interface CreateSystemConfigData {
  key: string;
  value: number;
  description?: string;
}

export interface UpdateSystemConfigData {
  key?: string;
  value?: number;
  description?: string;
}

export interface CreateRiskTierConfigData {
  tier: 'A' | 'B' | 'C' | 'D';
  spread: number;
  factor: number;
  allowed_terms: number[];
}

export interface UpdateRiskTierConfigData {
  tier?: 'A' | 'B' | 'C' | 'D';
  spread?: number;
  factor?: number;
  allowed_terms?: number[];
}

export interface CreateIndustryData {
  name: string;
  baseRiskTier: 'A' | 'B' | 'C' | 'D';
  description?: string;
}

export interface UpdateIndustryData {
  name?: string;
  baseRiskTier?: 'A' | 'B' | 'C' | 'D';
  description?: string;
}

// Credit Application interfaces for Admin
export type CreditApplicationStatus = 
  | 'No solicitado'       // DRAFT
  | 'No confirmado'       // APPLYING
  | 'Enviado'             // SUBMITTED
  | 'En revisión'         // UNDER_REVIEW
  | 'Documentos requeridos' // DOCUMENTS_REQUIRED
  | 'Aprobado'            // APPROVED
  | 'Rechazado'           // REJECTED
  | 'Desembolsado'        // DISBURSED
  | 'Cancelado'           // CANCELLED
  | 'No aplica';          // NOT_APPLICABLE

export interface AdminCreditApplication {
  id: string;
  applicationNumber: string;
  companyName: string;
  selectedAmount: number | null;
  approvedAmount: number | null;
  status: CreditApplicationStatus;
  submittedAt: string | null;
  reviewedAt: string | null;
  approvedAt: string | null;
  rejectionReason: string | null;
  internalNotes: string | null;
  riskScore: number | null;
  company: {
    annualRevenue: number;
    employeeCount: number;
  } | null;
  reviewedBy: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export interface PaginatedCreditApplicationsResponse {
  success: boolean;
  payload: {
    applications: AdminCreditApplication[];
    total: number;
    page: number;
    totalPages: number;
  };
}

export interface GetCreditApplicationsParams {
  page?: number;
  limit?: number;
  status?: CreditApplicationStatus;
  companyName?: string;
}

// Detailed Credit Application for Admin (includes all fields)
export interface StatusHistoryEntry {
  status: CreditApplicationStatus;
  timestamp: string;
  changedBy?: string;
  reason?: string;
}

export interface OfferDetails {
  minAmount: number;
  maxAmount: number;
  interestRate: number;
  allowedTerms: number[];
  calculationSnapshot: {
    baseRate: number;
    companyRiskTier: string;
    industryRiskTier: string;
    riskTierConfig: {
      tier: string;
      spread: number;
      factor: number;
    };
    systemConfigs: Record<string, number>;
    calculatedAt: string;
  };
}

export interface DetailedCreditApplication {
  id: string;
  applicationNumber: string;
  status: CreditApplicationStatus;
  selectedAmount: number | null;
  selectedTermMonths: number | null;
  approvedAmount: number | null;
  rejectionReason: string | null;
  internalNotes: string | null;
  userNotes: string | null;
  riskScore: number | null;
  submittedAt: string | null;
  reviewedAt: string | null;
  approvedAt: string | null;
  disbursedAt: string | null;
  createdAt: string;
  updatedAt: string;
  offerDetails: OfferDetails | null;
  statusHistory: StatusHistoryEntry[];
  company: {
    id: string;
    legalName: string;
    cuit: string;
    annualRevenue: number;
    employeeCount: number;
    foundedDate: string;
    industry: {
      id: string;
      name: string;
    } | null;
    owner: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    } | null;
  } | null;
  reviewedBy: {
    id: string;
    name: string;
    email: string;
  } | null;
  documents: {
    id: string;
    name: string;
    fileUrl: string;
    uploadedAt: string;
    type?: string;
    status?: string;
  }[];
}

export interface DetailedCreditApplicationResponse {
  success: boolean;
  payload: DetailedCreditApplication;
}

export interface UpdateCreditApplicationStatusData {
  newStatus: CreditApplicationStatus;
  rejectionReason?: string;
  internalNotes?: string;
  userNotes?: string;
  approvedAmount?: number;
  riskScore?: number;
}

export interface UpdateCreditApplicationStatusResponse {
  success: boolean;
  payload: {
    message: string;
    application: AdminCreditApplication;
  };
}

// Dashboard Stats
export interface DashboardRecentApplication {
  id: string;
  applicationNumber: string;
  companyName: string;
  selectedAmount: number | null;
  approvedAmount: number | null;
  status: CreditApplicationStatus;
  submittedAt: string | null;
  createdAt: string;
}

export interface DashboardStats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  recentApplications: DashboardRecentApplication[];
}

export interface DashboardStatsResponse {
  success: boolean;
  payload: DashboardStats;
}
