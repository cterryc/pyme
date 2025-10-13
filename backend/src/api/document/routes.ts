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

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

documentRouter.use(authenticate);

documentRouter.post(
  "/upload",
  upload.array("files", 10),
  schemaValidator(uploadDocumentValidator, null),
  DocumentController.uploadDocuments
);

documentRouter.get(
  "/company/:companyId",
  validateUuid,
  DocumentController.getDocumentsByCompany
);

documentRouter.delete(
  "/:id",
  validateUuid,
  DocumentController.deleteDocument
);

documentRouter.get(
  "/:id/download",
  validateUuid,
  DocumentController.getDocumentDownloadUrl
);

documentRouter.patch(
  "/:id/status",
  validateUuid,
  schemaValidator(updateDocumentStatusValidator, null),
  DocumentController.updateDocumentStatus
);

export default documentRouter;