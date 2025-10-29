"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const controller_1 = __importDefault(require("./controller"));
const authenticate_middleware_1 = __importDefault(require("../../middlewares/authenticate.middleware"));
const schemaValidators_middlewares_1 = __importDefault(require("../../middlewares/schemaValidators.middlewares"));
const validateParamId_middleware_1 = require("../../middlewares/validateParamId.middleware");
const validator_1 = require("./validator");
const documentRouter = (0, express_1.Router)();
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
    },
});
documentRouter.use(authenticate_middleware_1.default);
documentRouter.post("/upload", upload.array("files", 10), (0, schemaValidators_middlewares_1.default)(validator_1.uploadDocumentValidator, null), controller_1.default.uploadDocuments);
documentRouter.get("/company/:companyId", validateParamId_middleware_1.validateUuid, controller_1.default.getDocumentsByCompany);
documentRouter.delete("/:id", validateParamId_middleware_1.validateUuid, controller_1.default.deleteDocument);
documentRouter.get("/:id/download", validateParamId_middleware_1.validateUuid, controller_1.default.getDocumentDownloadUrl);
documentRouter.patch("/:id/status", validateParamId_middleware_1.validateUuid, (0, schemaValidators_middlewares_1.default)(validator_1.updateDocumentStatusValidator, null), controller_1.default.updateDocumentStatus);
exports.default = documentRouter;
