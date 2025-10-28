"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatus_1 = require("../../constants/HttpStatus");
const apiResponse_utils_1 = __importDefault(require("../../utils/apiResponse.utils"));
const service_1 = __importDefault(require("./service"));
class DocumentController {
}
_a = DocumentController;
DocumentController.documentService = new service_1.default();
DocumentController.uploadDocuments = async (req, res, next) => {
    try {
        const files = req.files;
        const userId = res.locals.user.id;
        const payload = {
            type: req.body.type,
            companyId: req.body.companyId,
            creditApplicationId: req.body.creditApplicationId,
        };
        const result = await _a.documentService.uploadDocuments(files, payload, userId);
        res
            .status(HttpStatus_1.HttpStatus.CREATED)
            .json((0, apiResponse_utils_1.default)(true, { documents: result }));
    }
    catch (err) {
        next(err);
    }
};
DocumentController.getDocumentsByCompany = async (req, res, next) => {
    try {
        const { companyId } = req.params;
        const result = await _a.documentService.getDocumentsByCompany(companyId);
        res.status(HttpStatus_1.HttpStatus.OK).json((0, apiResponse_utils_1.default)(true, { documents: result }));
    }
    catch (err) {
        next(err);
    }
};
DocumentController.deleteDocument = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = res.locals.user.id;
        await _a.documentService.deleteDocument(id, userId);
        res
            .status(HttpStatus_1.HttpStatus.OK)
            .json((0, apiResponse_utils_1.default)(true, { message: "Documento eliminado exitosamente" }));
    }
    catch (err) {
        next(err);
    }
};
DocumentController.getDocumentDownloadUrl = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await _a.documentService.getDocumentDownloadUrl(id);
        res.status(HttpStatus_1.HttpStatus.OK).json((0, apiResponse_utils_1.default)(true, result));
    }
    catch (err) {
        next(err);
    }
};
DocumentController.updateDocumentStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const reviewerId = res.locals.user.id;
        const payload = {
            status: req.body.status,
            rejectionReason: req.body.rejectionReason,
        };
        const result = await _a.documentService.updateDocumentStatus(id, payload, reviewerId);
        res.status(HttpStatus_1.HttpStatus.OK).json((0, apiResponse_utils_1.default)(true, result));
    }
    catch (err) {
        next(err);
    }
};
exports.default = DocumentController;
//# sourceMappingURL=controller.js.map