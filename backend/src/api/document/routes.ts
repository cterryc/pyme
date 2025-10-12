import { Router } from "express";
import multer from "multer";
import DocumentController from "./controller";
import authenticate from "../../middlewares/authenticate.middleware";
import schemaValidator from "../../middlewares/schemaValidators.middlewares";
import { validateUuid } from "../../middlewares/validateParamId.middleware";
import {
  uploadDocumentValidator,
  updateDocumentStatusValidator,
} from "./validator";

const documentRouter = Router();

// Configurar multer para almacenamiento en memoria
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// Todas las rutas requieren autenticación
documentRouter.use(authenticate);

/**
 * @route   POST /api/documents/upload
 * @desc    Subir uno o múltiples documentos
 * @access  Private
 */
documentRouter.post(
  "/upload",
  upload.array("files", 10),
  schemaValidator(uploadDocumentValidator, null),
  DocumentController.uploadDocuments
);

/**
 * @route   GET /api/documents/company/:companyId
 * @desc    Obtener todos los documentos de una empresa
 * @access  Private
 */
documentRouter.get(
  "/company/:companyId",
  validateUuid,
  DocumentController.getDocumentsByCompany
);

/**
 * @route   DELETE /api/documents/:id
 * @desc    Eliminar un documento (soft delete)
 * @access  Private
 */
documentRouter.delete(
  "/:id",
  validateUuid,
  DocumentController.deleteDocument
);

/**
 * @route   GET /api/documents/:id/download
 * @desc    Obtener URL de descarga de un documento
 * @access  Private
 */
documentRouter.get(
  "/:id/download",
  validateUuid,
  DocumentController.getDocumentDownloadUrl
);

/**
 * @route   PATCH /api/documents/:id/status
 * @desc    Actualizar el estado de un documento
 * @access  Private
 */
documentRouter.patch(
  "/:id/status",
  validateUuid,
  schemaValidator(updateDocumentStatusValidator, null),
  DocumentController.updateDocumentStatus
);

export default documentRouter;