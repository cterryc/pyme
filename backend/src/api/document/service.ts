import { Repository } from "typeorm";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import { AppDataSource } from "../../config/data-source";
import { Document } from "../../entities/Document.entity";
import { Company } from "../../entities/Company.entity";
import { CreditApplication } from "../../entities/CreditApplication.entity";
import HttpError from "../../utils/HttpError.utils";
import { HttpStatus } from "../../constants/HttpStatus";
import config from "../../config/enviroment.config";
import {
  IUploadDocumentPayload,
  IDocumentResponse,
  IUpdateDocumentStatusPayload,
  IUploadedFile,
} from "./interfaces";
import { DocumentStatus } from "../../constants/CreditStatus";

export default class DocumentService {
  private readonly documentRepo: Repository<Document>;
  private readonly companyRepo: Repository<Company>;
  private readonly creditApplicationRepo: Repository<CreditApplication>;
  private readonly supabase: SupabaseClient;

  constructor() {
    this.documentRepo = AppDataSource.getRepository(Document);
    this.companyRepo = AppDataSource.getRepository(Company);
    this.creditApplicationRepo = AppDataSource.getRepository(CreditApplication);
    this.supabase = createClient(
      config.SUPABASE_URL,
      config.SUPABASE_SERVICE_ROLE_KEY
    );
  }

  async uploadDocuments(
    files: IUploadedFile[],
    payload: IUploadDocumentPayload,
    userId: string
  ): Promise<IDocumentResponse[]> {
    // Validar que existan archivos
    if (!files || files.length === 0) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        "No se proporcionaron archivos"
      );
    }

    // Validar que la empresa exista
    const company = await this.companyRepo.findOne({
      where: { id: payload.companyId },
    });

    if (!company) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Empresa no encontrada");
    }

    // Validar creditApplicationId si se proporciona
    if (payload.creditApplicationId) {
      const creditApplication = await this.creditApplicationRepo.findOne({
        where: { id: payload.creditApplicationId },
      });

      if (!creditApplication) {
        throw new HttpError(
          HttpStatus.NOT_FOUND,
          "Solicitud de crédito no encontrada"
        );
      }
    }

    // Validar tipos de archivo permitidos
    const allowedMimeTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];

    for (const file of files) {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new HttpError(
          HttpStatus.BAD_REQUEST,
          `El archivo "${file.originalname}" no es válido. Solo se permiten PDF e imágenes (JPG, PNG).`
        );
      }

      // Validar tamaño de archivo (10MB)
      if (file.size > config.MAX_FILE_SIZE) {
        throw new HttpError(
          HttpStatus.BAD_REQUEST,
          `El archivo "${file.originalname}" excede el tamaño máximo permitido de 10MB.`
        );
      }
    }

    // Subir archivos a Supabase Storage
    const uploadPromises = files.map(async (file) => {
      const fileExtension = file.originalname.split(".").pop();
      const uniqueFileName = `${randomUUID()}_${Date.now()}.${fileExtension}`;
      const filePath = `${payload.companyId}/${uniqueFileName}`;

      const { data, error } = await this.supabase.storage
        .from(config.SUPABASE_STORAGE_BUCKET)
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (error) {
        console.error("Error uploading to Supabase:", error);
        throw new HttpError(
          HttpStatus.SERVER_ERROR,
          `Error al subir el archivo "${file.originalname}": ${error.message}`
        );
      }

      // Obtener URL pública
      const { data: publicUrlData } = this.supabase.storage
        .from(config.SUPABASE_STORAGE_BUCKET)
        .getPublicUrl(filePath);

      // Guardar documento en la base de datos
      const document = this.documentRepo.create({
        type: payload.type,
        fileName: file.originalname,
        fileUrl: publicUrlData.publicUrl,
        storagePath: filePath,
        mimeType: file.mimetype,
        fileSize: file.size,
        status: DocumentStatus.PENDING,
        companyId: payload.companyId,
        creditApplicationId: payload.creditApplicationId,
        uploadedById: userId,
        contentHash: data.path, // Usar el path como hash temporal
      });

      const savedDocument = await this.documentRepo.save(document);

      return this.mapToDocumentResponse(savedDocument);
    });

    return await Promise.all(uploadPromises);
  }

  async getDocumentsByCompany(companyId: string): Promise<IDocumentResponse[]> {
    const company = await this.companyRepo.findOne({
      where: { id: companyId },
    });

    if (!company) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Empresa no encontrada");
    }

    const documents = await this.documentRepo.find({
      where: { companyId },
      order: { createdAt: "DESC" },
    });

    return documents.map((doc) => this.mapToDocumentResponse(doc));
  }

  async deleteDocument(documentId: string, userId: string): Promise<void> {
    const document = await this.documentRepo.findOne({
      where: { id: documentId },
    });

    if (!document) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Documento no encontrado");
    }

    // Soft delete en la base de datos
    await this.documentRepo.softDelete(documentId);

    // Opcional: Eliminar de Supabase Storage
    if (document.storagePath) {
      const { error } = await this.supabase.storage
        .from(config.SUPABASE_STORAGE_BUCKET)
        .remove([document.storagePath]);

      if (error) {
        console.error("Error deleting from Supabase:", error);
        // No lanzar error, ya que el soft delete en DB fue exitoso
      }
    }
  }

  async getDocumentDownloadUrl(documentId: string): Promise<{ url: string }> {
    const document = await this.documentRepo.findOne({
      where: { id: documentId },
    });

    if (!document) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Documento no encontrado");
    }

    if (!document.storagePath) {
      throw new HttpError(
        HttpStatus.SERVER_ERROR,
        "No se encontró la ruta de almacenamiento del documento"
      );
    }

    // Generar URL de descarga con firma temporal (válida por 1 hora)
    const { data, error } = await this.supabase.storage
      .from(config.SUPABASE_STORAGE_BUCKET)
      .createSignedUrl(document.storagePath, 3600);

    if (error || !data) {
      throw new HttpError(
        HttpStatus.SERVER_ERROR,
        "Error al generar URL de descarga"
      );
    }

    return { url: data.signedUrl };
  }

  async updateDocumentStatus(
    documentId: string,
    payload: IUpdateDocumentStatusPayload,
    reviewerId: string
  ): Promise<IDocumentResponse> {
    const document = await this.documentRepo.findOne({
      where: { id: documentId },
    });

    if (!document) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Documento no encontrado");
    }

    // Validar que si el estado es REJECTED, se proporcione un motivo
    if (
      payload.status === DocumentStatus.REJECTED &&
      !payload.rejectionReason
    ) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        "Debe proporcionar un motivo de rechazo"
      );
    }

    document.status = payload.status;
    document.rejectionReason = payload.rejectionReason;
    document.reviewedById = reviewerId;
    document.reviewedAt = new Date();

    const updatedDocument = await this.documentRepo.save(document);

    return this.mapToDocumentResponse(updatedDocument);
  }

  private mapToDocumentResponse(document: Document): IDocumentResponse {
    return {
      id: document.id,
      type: document.type,
      fileName: document.fileName,
      fileUrl: document.fileUrl,
      mimeType: document.mimeType || "",
      fileSize: Number(document.fileSize) || 0,
      status: document.status,
      companyId: document.companyId,
      creditApplicationId: document.creditApplicationId,
      uploadedById: document.uploadedById,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }
}
