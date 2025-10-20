import { CreditApplication } from "../../entities/CreditApplication.entity";
import { Company } from "../../entities/Company.entity";
import { Document } from "../../entities/Document.entity";

/**
 * Helper para convertir fechas a ISO string de manera segura
 */
function toISOStringSafe(date: Date | string | null | undefined): string | null {
  if (!date) return null;
  
  try {
    // Si ya es un string, retornarlo
    if (typeof date === 'string') return date;
    
    // Si es un Date, convertir a ISO string
    if (date instanceof Date) return date.toISOString();
    
    // Intentar convertir a Date si es otro tipo
    const dateObj = new Date(date as any);
    if (!isNaN(dateObj.getTime())) {
      return dateObj.toISOString();
    }
    
    return null;
  } catch (error) {
    console.error('Error converting date:', date, error);
    return null;
  }
}

/**
 * DTO para el listado de solicitudes de crédito (Admin)
 */
export interface CreditApplicationListItemDto {
  id: string;
  applicationNumber: string;
  status: string;
  selectedAmount: number | null;
  selectedTermMonths: number | null;
  approvedAmount: number | null;
  riskScore: number | null;
  submittedAt: string | null;
  createdAt: string;
  updatedAt: string;
  
  // Información de la compañía
  company: {
    id: string;
    legalName: string;
    taxId: string;
    email: string | null;
    industry: string | null;
  };
  
  // Información del dueño
  owner: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
  
  // Información de documentos
  documentsCount: number;
  pendingDocumentsCount: number;
}

/**
 * DTO detallado de una solicitud de crédito (Admin)
 */
export interface CreditApplicationDetailDto {
  id: string;
  applicationNumber: string;
  status: string;
  
  // Detalles de la oferta
  offerDetails: {
    minAmount: number;
    maxAmount: number;
    interestRate: number;
    allowedTerms: number[];
  } | null;
  
  // Selección del usuario
  selectedAmount: number | null;
  selectedTermMonths: number | null;
  
  // Revisión del admin
  approvedAmount: number | null;
  rejectionReason: string | null;
  internalNotes: string | null;
  riskScore: number | null;
  
  // Fechas
  submittedAt: string | null;
  reviewedAt: string | null;
  approvedAt: string | null;
  disbursedAt: string | null;
  createdAt: string;
  updatedAt: string;
  
  // Historial de estados
  statusHistory: {
    status: string;
    timestamp: string;
    changedBy: string | null;
    reason: string | null;
  }[];
  
  // Información de la compañía
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
  
  // Información del dueño
  owner: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
  };
  
  // Documentos relacionados
  documents: {
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
  }[];
  
  // Revisor (si existe)
  reviewedBy: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  } | null;
}

/**
 * Convierte una CreditApplication a DTO de lista (Admin)
 */
export function toCreditApplicationListItemDto(
  application: CreditApplication
): CreditApplicationListItemDto {
  return {
    id: application.id,
    applicationNumber: application.applicationNumber,
    status: application.status,
    selectedAmount: application.selectedAmount ? Number(application.selectedAmount) : null,
    selectedTermMonths: application.selectedTermMonths ?? null,
    approvedAmount: application.approvedAmount ? Number(application.approvedAmount) : null,
    riskScore: application.riskScore ?? null,
    submittedAt: toISOStringSafe(application.submittedAt),
    createdAt: toISOStringSafe(application.createdAt) ?? '',
    updatedAt: toISOStringSafe(application.updatedAt) ?? '',
    
    company: {
      id: application.company.id,
      legalName: application.company.legalName,
      taxId: application.company.taxId,
      email: application.company.email ?? null,
      industry: application.company.industry?.name ?? null,
    },
    
    owner: {
      id: application.company.owner.id,
      email: application.company.owner.email,
      firstName: application.company.owner.firstName ?? null,
      lastName: application.company.owner.lastName ?? null,
    },
    
    documentsCount: application.documents?.length ?? 0,
    pendingDocumentsCount: application.documents?.filter(d => d.status === "Pending").length ?? 0,
  };
}

/**
 * Convierte una CreditApplication a DTO detallado (Admin)
 */
export function toCreditApplicationDetailDto(
  application: CreditApplication
): CreditApplicationDetailDto {
  return {
    id: application.id,
    applicationNumber: application.applicationNumber,
    status: application.status,
    
    offerDetails: application.offerDetails ?? null,
    
    selectedAmount: application.selectedAmount ? Number(application.selectedAmount) : null,
    selectedTermMonths: application.selectedTermMonths ?? null,
    
    approvedAmount: application.approvedAmount ? Number(application.approvedAmount) : null,
    rejectionReason: application.rejectionReason ?? null,
    internalNotes: application.internalNotes ?? null,
    riskScore: application.riskScore ?? null,
    
    submittedAt: toISOStringSafe(application.submittedAt),
    reviewedAt: toISOStringSafe(application.reviewedAt),
    approvedAt: toISOStringSafe(application.approvedAt),
    disbursedAt: toISOStringSafe(application.disbursedAt),
    createdAt: toISOStringSafe(application.createdAt) ?? '',
    updatedAt: toISOStringSafe(application.updatedAt) ?? '',
    
    statusHistory: (application.statusHistory ?? []).map(history => ({
      status: history.status,
      timestamp: toISOStringSafe(history.timestamp) ?? '',
      changedBy: history.changedBy ?? null,
      reason: history.reason ?? null,
    })),
    
    company: {
      id: application.company.id,
      legalName: application.company.legalName,
      tradeName: application.company.tradeName ?? null,
      taxId: application.company.taxId,
      email: application.company.email ?? null,
      phone: application.company.phone ?? null,
      foundedDate: toISOStringSafe(application.company.foundedDate),
      employeeCount: application.company.employeeCount ?? null,
      annualRevenue: application.company.annualRevenue ? Number(application.company.annualRevenue) : null,
      address: application.company.address ?? null,
      city: application.company.city ?? null,
      state: application.company.state ?? null,
      country: application.company.country ?? null,
      website: application.company.website ?? null,
      description: application.company.description ?? null,
      industry: application.company.industry
        ? {
            id: application.company.industry.id,
            name: application.company.industry.name,
            baseRiskTier: application.company.industry.baseRiskTier,
          }
        : null,
    },
    
    owner: {
      id: application.company.owner.id,
      email: application.company.owner.email,
      firstName: application.company.owner.firstName ?? null,
      lastName: application.company.owner.lastName ?? null,
      phone: application.company.owner.phone ?? null,
    },
    
    documents: (application.documents ?? []).map(doc => ({
      id: doc.id,
      type: doc.type,
      fileName: doc.fileName,
      fileUrl: doc.fileUrl,
      status: doc.status,
      mimeType: doc.mimeType ?? null,
      fileSize: doc.fileSize ? Number(doc.fileSize) : null,
      rejectionReason: doc.rejectionReason ?? null,
      uploadedAt: toISOStringSafe(doc.createdAt) ?? '',
      reviewedAt: toISOStringSafe(doc.reviewedAt),
    })),
    
    reviewedBy: application.reviewedBy
      ? {
          id: application.reviewedBy.id,
          email: application.reviewedBy.email,
          firstName: application.reviewedBy.firstName ?? null,
          lastName: application.reviewedBy.lastName ?? null,
        }
      : null,
  };
}
