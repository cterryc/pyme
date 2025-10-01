export enum CreditApplicationStatus {
    DRAFT = "Draft",
    SUBMITTED = "Submitted",
    UNDER_REVIEW = "Under Review",
    DOCUMENTS_REQUIRED = "Documents Required",
    KYC_PENDING = "KYC Pending",
    KYC_APPROVED = "KYC Approved",
    KYC_REJECTED = "KYC Rejected",
    APPROVED = "Approved",
    REJECTED = "Rejected",
    DISBURSED = "Disbursed",
    CANCELLED = "Cancelled",
}

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
