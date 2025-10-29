"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KYCStatus = exports.DocumentStatus = exports.DocumentType = exports.ALLOWED_STATUS_TRANSITIONS = exports.CreditApplicationStatus = void 0;
var CreditApplicationStatus;
(function (CreditApplicationStatus) {
    CreditApplicationStatus["DRAFT"] = "No solicitado";
    CreditApplicationStatus["APPLYING"] = "No confirmado";
    CreditApplicationStatus["SUBMITTED"] = "Enviado";
    CreditApplicationStatus["UNDER_REVIEW"] = "En revisi\u00F3n";
    CreditApplicationStatus["DOCUMENTS_REQUIRED"] = "Documentos requeridos";
    CreditApplicationStatus["APPROVED"] = "Aprobado";
    CreditApplicationStatus["REJECTED"] = "Rechazado";
    CreditApplicationStatus["DISBURSED"] = "Desembolsado";
    CreditApplicationStatus["CANCELLED"] = "Cancelado";
    CreditApplicationStatus["NOT_APPLICABLE"] = "No aplica";
})(CreditApplicationStatus || (exports.CreditApplicationStatus = CreditApplicationStatus = {}));
// Transiciones de estado permitidas para el admin
exports.ALLOWED_STATUS_TRANSITIONS = {
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
var DocumentType;
(function (DocumentType) {
    DocumentType["ID_DOCUMENT"] = "ID Document";
    DocumentType["PROOF_OF_ADDRESS"] = "Proof of Address";
    DocumentType["TAX_RETURN"] = "Tax Return";
    DocumentType["FINANCIAL_STATEMENT"] = "Financial Statement";
    DocumentType["BANK_STATEMENT"] = "Bank Statement";
    DocumentType["BUSINESS_LICENSE"] = "Business License";
    DocumentType["ARTICLES_OF_INCORPORATION"] = "Articles of Incorporation";
    DocumentType["OTHER"] = "Other";
})(DocumentType || (exports.DocumentType = DocumentType = {}));
var DocumentStatus;
(function (DocumentStatus) {
    DocumentStatus["PENDING"] = "Pending";
    DocumentStatus["APPROVED"] = "Approved";
    DocumentStatus["REJECTED"] = "Rejected";
    DocumentStatus["REQUIRES_REUPLOAD"] = "Requires Reupload";
})(DocumentStatus || (exports.DocumentStatus = DocumentStatus = {}));
var KYCStatus;
(function (KYCStatus) {
    KYCStatus["NOT_STARTED"] = "Not Started";
    KYCStatus["IN_PROGRESS"] = "In Progress";
    KYCStatus["COMPLETED"] = "Completed";
    KYCStatus["APPROVED"] = "Approved";
    KYCStatus["REJECTED"] = "Rejected";
})(KYCStatus || (exports.KYCStatus = KYCStatus = {}));
