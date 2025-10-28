export enum CreditApplicationStatus {
    DRAFT = "No solicitado",
    APPLYING = "No confirmado",
    SUBMITTED = "Enviado",
    UNDER_REVIEW = "En revisión",
    DOCUMENTS_REQUIRED = "Documentos requeridos",
    APPROVED = "Aprobado",
    REJECTED = "Rechazado",
    DISBURSED = "Desembolsado",
    CANCELLED = "Cancelado",
    NOT_APPLICABLE = "No aplica"
}

// Transiciones de estado permitidas para el admin
export const ALLOWED_STATUS_TRANSITIONS: Record<CreditApplicationStatus, CreditApplicationStatus[]> = {
    [CreditApplicationStatus.DRAFT]: [
        CreditApplicationStatus.APPLYING,
        CreditApplicationStatus.CANCELLED,
        CreditApplicationStatus.NOT_APPLICABLE
    ],
    [CreditApplicationStatus.APPLYING]: [
        CreditApplicationStatus.SUBMITTED,
        CreditApplicationStatus.CANCELLED,
        CreditApplicationStatus.NOT_APPLICABLE
    ],
    [CreditApplicationStatus.SUBMITTED]: [
        CreditApplicationStatus.UNDER_REVIEW,
        CreditApplicationStatus.CANCELLED,
        CreditApplicationStatus.REJECTED
    ],
    [CreditApplicationStatus.UNDER_REVIEW]: [
        CreditApplicationStatus.DOCUMENTS_REQUIRED,
        CreditApplicationStatus.APPROVED,
        CreditApplicationStatus.REJECTED
    ],
    [CreditApplicationStatus.DOCUMENTS_REQUIRED]: [
        CreditApplicationStatus.UNDER_REVIEW,
        CreditApplicationStatus.APPROVED,
        CreditApplicationStatus.REJECTED
    ],
    [CreditApplicationStatus.APPROVED]: [
        CreditApplicationStatus.DISBURSED,
        CreditApplicationStatus.CANCELLED
    ],
    [CreditApplicationStatus.REJECTED]: [
        // No se puede cambiar desde rechazado
    ],
    [CreditApplicationStatus.DISBURSED]: [
        // Estado final, no se puede cambiar
    ],
    [CreditApplicationStatus.CANCELLED]: [
        // Estado final, no se puede cambiar
    ],
    [CreditApplicationStatus.NOT_APPLICABLE]: [
        // Estado final, no se puede cambiar
    ]
};

export enum DocumentType {
    ID_DOCUMENT = "ID Document",
    PROOF_OF_ADDRESS = "Proof of Address",
    TAX_RETURN = "Tax Return",
    FINANCIAL_STATEMENT = "Financial Statement",
    BANK_STATEMENT = "Bank Statement",
    BUSINESS_LICENSE = "Business License",
    ARTICLES_OF_INCORPORATION = "Articles of Incorporation",
    OTHER = "Other",
}

export enum DocumentStatus {
    PENDING = "Pending",
    APPROVED = "Approved",
    REJECTED = "Rejected",
    REQUIRES_REUPLOAD = "Requires Reupload",
}

export enum KYCStatus {
    NOT_STARTED = "Not Started",
    IN_PROGRESS = "In Progress",
    COMPLETED = "Completed",
    APPROVED = "Approved",
    REJECTED = "Rejected",
}
