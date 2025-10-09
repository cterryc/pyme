import { DocumentType, DocumentStatus } from "../../constants/CreditStatus";

export interface IUploadDocumentPayload {
  type: DocumentType;
  companyId: string;
  creditApplicationId?: string;
}

export interface IDocumentResponse {
  id: string;
  type: DocumentType;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  status: DocumentStatus;
  companyId: string;
  creditApplicationId?: string;
  uploadedById?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUpdateDocumentStatusPayload {
  status: DocumentStatus;
  rejectionReason?: string;
}

export interface IUploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}