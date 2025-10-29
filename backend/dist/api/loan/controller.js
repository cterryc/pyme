"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatus_1 = require("../../constants/HttpStatus");
const apiResponse_utils_1 = __importDefault(require("../../utils/apiResponse.utils"));
const service_1 = __importDefault(require("./service"));
const validator_1 = require("./validator");
class LoanController {
}
_a = LoanController;
LoanController.loanService = new service_1.default();
LoanController.loanRequest = async (req, res, next) => {
    try {
        const userId = res.locals.user?.id;
        const companyId = validator_1.loanRequestSchema.parse(req.body).companyId;
        const formLoanRequest = await _a.loanService.loanRequest(userId, companyId);
        res.status(HttpStatus_1.HttpStatus.OK).json((0, apiResponse_utils_1.default)(true, formLoanRequest));
    }
    catch (error) {
        return next(error);
    }
};
LoanController.createCreditApplication = async (req, res, next) => {
    try {
        const userId = res.locals.user?.id;
        const loanData = validator_1.createCreditApplicationSchema.parse(req.body);
        const loanRequest = await _a.loanService.createCreditApplication(loanData.id, loanData.selectedAmount, loanData.selectedTermMonths, loanData.companyId, userId);
        res.status(HttpStatus_1.HttpStatus.CREATED).json((0, apiResponse_utils_1.default)(true, loanRequest));
    }
    catch (error) {
        return next(error);
    }
};
LoanController.listCreditApplicationsByUserId = async (req, res, next) => {
    try {
        const userId = res.locals.user?.id;
        const applications = await _a.loanService.listCreditApplicationsByUserId(userId);
        res.status(HttpStatus_1.HttpStatus.OK).json((0, apiResponse_utils_1.default)(true, applications));
    }
    catch (error) {
        return next(error);
    }
};
LoanController.getCreditApplicationStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const statusInfo = await _a.loanService.getCreditApplicationStatus(id);
        res.status(HttpStatus_1.HttpStatus.OK).json((0, apiResponse_utils_1.default)(true, statusInfo));
    }
    catch (error) {
        return next(error);
    }
};
LoanController.listCreditApplications = async (req, res, next) => {
    try {
        const { page, limit, status } = req.query;
        const result = await _a.loanService.listCreditApplications(page, limit, status);
        res.status(HttpStatus_1.HttpStatus.OK).json((0, apiResponse_utils_1.default)(true, result));
    }
    catch (error) {
        return next(error);
    }
};
LoanController.getCreditApplicationById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const application = await _a.loanService.getCreditApplicationById(id);
        res.status(HttpStatus_1.HttpStatus.OK).json((0, apiResponse_utils_1.default)(true, application));
    }
    catch (error) {
        return next(error);
    }
};
LoanController.deleteCreditApplication = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = res.locals.user?.id;
        const result = await _a.loanService.deleteCreditApplication(id, userId);
        res.status(HttpStatus_1.HttpStatus.OK).json((0, apiResponse_utils_1.default)(true, result));
    }
    catch (error) {
        return next(error);
    }
};
// --- MÉTODOS ADMINISTRATIVOS ---
LoanController.updateCreditApplicationStatus = async (req, res, next) => {
    try {
        const applicationId = req.params.id;
        const adminUserId = res.locals.user?.id;
        const { newStatus, rejectionReason, internalNotes, approvedAmount, riskScore, } = req.body;
        const result = await _a.loanService.updateCreditApplicationStatus(applicationId, newStatus, adminUserId, rejectionReason, internalNotes, approvedAmount, riskScore);
        res.status(HttpStatus_1.HttpStatus.OK).json((0, apiResponse_utils_1.default)(true, result));
    }
    catch (error) {
        return next(error);
    }
};
LoanController.getCreditApplicationsForAdmin = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;
        const companyName = req.query.companyName;
        const result = await _a.loanService.getCreditApplicationsForAdmin(page, limit, status, companyName);
        res.status(HttpStatus_1.HttpStatus.OK).json((0, apiResponse_utils_1.default)(true, result));
    }
    catch (error) {
        return next(error);
    }
};
exports.default = LoanController;
