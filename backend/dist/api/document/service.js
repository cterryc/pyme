"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_js_1 = require("@supabase/supabase-js");
const crypto_1 = require("crypto");
const data_source_1 = require("../../config/data-source");
const Document_entity_1 = require("../../entities/Document.entity");
const Company_entity_1 = require("../../entities/Company.entity");
const CreditApplication_entity_1 = require("../../entities/CreditApplication.entity");
const HttpError_utils_1 = __importDefault(require("../../utils/HttpError.utils"));
const HttpStatus_1 = require("../../constants/HttpStatus");
const enviroment_config_1 = __importDefault(require("../../config/enviroment.config"));
const CreditStatus_1 = require("../../constants/CreditStatus");
class DocumentService {
    constructor() {
        this.documentRepo = data_source_1.AppDataSource.getRepository(Document_entity_1.Document);
        this.companyRepo = data_source_1.AppDataSource.getRepository(Company_entity_1.Company);
        this.creditApplicationRepo = data_source_1.AppDataSource.getRepository(CreditApplication_entity_1.CreditApplication);
        this.supabase = (0, supabase_js_1.createClient)(enviroment_config_1.default.SUPABASE_URL, enviroment_config_1.default.SUPABASE_SERVICE_ROLE_KEY);
    }
    async uploadDocuments(files, payload, userId) {
        // Validar que existan archivos
        if (!files || files.length === 0) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.BAD_REQUEST, "No se proporcionaron archivos");
        }
        // Validar que la empresa exista
        const company = await this.companyRepo.findOne({
            where: { id: payload.companyId },
        });
        if (!company) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.NOT_FOUND, "Empresa no encontrada");
        }
        // Validar creditApplicationId si se proporciona
        if (payload.creditApplicationId) {
            const creditApplication = await this.creditApplicationRepo.findOne({
                where: { id: payload.creditApplicationId },
            });
            if (!creditApplication) {
                throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.NOT_FOUND, "Solicitud de crédito no encontrada");
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
                throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.BAD_REQUEST, `El archivo "${file.originalname}" no es válido. Solo se permiten PDF e imágenes (JPG, PNG).`);
            }
            // Validar tamaño de archivo (10MB)
            if (file.size > enviroment_config_1.default.MAX_FILE_SIZE) {
                throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.BAD_REQUEST, `El archivo "${file.originalname}" excede el tamaño máximo permitido de 10MB.`);
            }
        }
        // Subir archivos a Supabase Storage
        const uploadPromises = files.map(async (file) => {
            const fileExtension = file.originalname.split(".").pop();
            const uniqueFileName = `${(0, crypto_1.randomUUID)()}_${Date.now()}.${fileExtension}`;
            const filePath = `${payload.companyId}/${uniqueFileName}`;
            const { data, error } = await this.supabase.storage
                .from(enviroment_config_1.default.SUPABASE_STORAGE_BUCKET)
                .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: false,
            });
            if (error) {
                console.error("Error uploading to Supabase:", error);
                throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.SERVER_ERROR, `Error al subir el archivo "${file.originalname}": ${error.message}`);
            }
            // Obtener URL pública
            const { data: publicUrlData } = this.supabase.storage
                .from(enviroment_config_1.default.SUPABASE_STORAGE_BUCKET)
                .getPublicUrl(filePath);
            // Guardar documento en la base de datos
            const document = this.documentRepo.create({
                type: payload.type,
                fileName: file.originalname,
                fileUrl: publicUrlData.publicUrl,
                storagePath: filePath,
                mimeType: file.mimetype,
                fileSize: file.size,
                status: CreditStatus_1.DocumentStatus.PENDING,
                companyId: payload.companyId,
                creditApplicationId: payload.creditApplicationId,
                uploadedById: userId,
                contentHash: data.path, // Usar el path como hash temporal
            });
            const savedDocument = await this.documentRepo.save(document);
            return this.mapToDocumentResponse(savedDocument);
        });
        const response = await Promise.all(uploadPromises);
        // filtrar y devolver el archivo pdf
        const pdfFile = response.filter((file) => file.mimeType === 'application/pdf');
        return pdfFile;
    }
    async getDocumentsByCompany(companyId) {
        const company = await this.companyRepo.findOne({
            where: { id: companyId },
        });
        if (!company) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.NOT_FOUND, "Empresa no encontrada");
        }
        const documents = await this.documentRepo.find({
            where: { companyId },
            order: { createdAt: "DESC" },
        });
        return documents.map((doc) => this.mapToDocumentResponse(doc));
    }
    async deleteDocument(documentId, userId) {
        const document = await this.documentRepo.findOne({
            where: { id: documentId },
        });
        if (!document) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.NOT_FOUND, "Documento no encontrado");
        }
        // Soft delete en la base de datos
        await this.documentRepo.softDelete(documentId);
        // Opcional: Eliminar de Supabase Storage
        if (document.storagePath) {
            const { error } = await this.supabase.storage
                .from(enviroment_config_1.default.SUPABASE_STORAGE_BUCKET)
                .remove([document.storagePath]);
            if (error) {
                console.error("Error deleting from Supabase:", error);
                // No lanzar error, ya que el soft delete en DB fue exitoso
            }
        }
    }
    async getDocumentDownloadUrl(documentId) {
        const document = await this.documentRepo.findOne({
            where: { id: documentId },
        });
        if (!document) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.NOT_FOUND, "Documento no encontrado");
        }
        if (!document.storagePath) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.SERVER_ERROR, "No se encontró la ruta de almacenamiento del documento");
        }
        // Generar URL de descarga con firma temporal (válida por 1 hora)
        const { data, error } = await this.supabase.storage
            .from(enviroment_config_1.default.SUPABASE_STORAGE_BUCKET)
            .createSignedUrl(document.storagePath, 3600);
        if (error || !data) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.SERVER_ERROR, "Error al generar URL de descarga");
        }
        return { url: data.signedUrl };
    }
    async updateDocumentStatus(documentId, payload, reviewerId) {
        const document = await this.documentRepo.findOne({
            where: { id: documentId },
        });
        if (!document) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.NOT_FOUND, "Documento no encontrado");
        }
        // Validar que si el estado es REJECTED, se proporcione un motivo
        if (payload.status === CreditStatus_1.DocumentStatus.REJECTED &&
            !payload.rejectionReason) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.BAD_REQUEST, "Debe proporcionar un motivo de rechazo");
        }
        document.status = payload.status;
        document.rejectionReason = payload.rejectionReason;
        document.reviewedById = reviewerId;
        document.reviewedAt = new Date();
        const updatedDocument = await this.documentRepo.save(document);
        return this.mapToDocumentResponse(updatedDocument);
    }
    mapToDocumentResponse(document) {
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
exports.default = DocumentService;
