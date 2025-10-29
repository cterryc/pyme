"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatus_1 = require("../../constants/HttpStatus");
const apiResponse_utils_1 = __importDefault(require("../../utils/apiResponse.utils"));
const service_1 = __importDefault(require("./service"));
const service_2 = __importDefault(require("../loan/service"));
const CreditStatus_1 = require("../../constants/CreditStatus");
const validator_1 = require("./validator");
class AdminController {
}
_a = AdminController;
AdminController.service = new service_1.default();
AdminController.loanService = new service_2.default();
AdminController.listSystemConfigs = async (req, res, next) => {
    try {
        const result = await _a.service.listSystemConfigs();
        res.status(HttpStatus_1.HttpStatus.OK).json((0, apiResponse_utils_1.default)(true, result));
    }
    catch (error) {
        return next(error);
    }
};
AdminController.createSystemConfig = async (req, res, next) => {
    try {
        const dto = validator_1.createSystemConfigSchema.parse(req.body);
        const created = await _a.service.createSystemConfig(dto);
        res.status(HttpStatus_1.HttpStatus.CREATED).json((0, apiResponse_utils_1.default)(true, created));
    }
    catch (error) {
        return next(error);
    }
};
AdminController.getSystemConfigById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const entity = await _a.service.getSystemConfigById(id);
        res.status(HttpStatus_1.HttpStatus.OK).json((0, apiResponse_utils_1.default)(true, entity));
    }
    catch (error) {
        return next(error);
    }
};
AdminController.updateSystemConfig = async (req, res, next) => {
    try {
        const { id } = req.params;
        const dto = validator_1.updateSystemConfigSchema.parse(req.body);
        const updated = await _a.service.updateSystemConfig(id, dto);
        res.status(HttpStatus_1.HttpStatus.OK).json((0, apiResponse_utils_1.default)(true, updated));
    }
    catch (error) {
        return next(error);
    }
};
AdminController.deleteSystemConfig = async (req, res, next) => {
    try {
        const { id } = req.params;
        await _a.service.deleteSystemConfig(id);
        res.status(HttpStatus_1.HttpStatus.OK).json((0, apiResponse_utils_1.default)(true, { message: "Eliminado" }));
    }
    catch (error) {
        return next(error);
    }
};
AdminController.listRiskTierConfigs = async (req, res, next) => {
    try {
        const result = await _a.service.listRiskTierConfigs();
        res.status(HttpStatus_1.HttpStatus.OK).json((0, apiResponse_utils_1.default)(true, result));
    }
    catch (error) {
        return next(error);
    }
};
AdminController.createRiskTierConfig = async (req, res, next) => {
    try {
        const dto = validator_1.createRiskTierConfigSchema.parse(req.body);
        const created = await _a.service.createRiskTierConfig(dto);
        res.status(HttpStatus_1.HttpStatus.CREATED).json((0, apiResponse_utils_1.default)(true, created));
    }
    catch (error) {
        return next(error);
    }
};
AdminController.getRiskTierConfigById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const entity = await _a.service.getRiskTierConfigById(id);
        res.status(HttpStatus_1.HttpStatus.OK).json((0, apiResponse_utils_1.default)(true, entity));
    }
    catch (error) {
        return next(error);
    }
};
AdminController.updateRiskTierConfig = async (req, res, next) => {
    try {
        const { id } = req.params;
        const dto = validator_1.updateRiskTierConfigSchema.parse(req.body);
        const updated = await _a.service.updateRiskTierConfig(id, dto);
        res.status(HttpStatus_1.HttpStatus.OK).json((0, apiResponse_utils_1.default)(true, updated));
    }
    catch (error) {
        return next(error);
    }
};
AdminController.deleteRiskTierConfig = async (req, res, next) => {
    try {
        const { id } = req.params;
        await _a.service.deleteRiskTierConfig(id);
        res.status(HttpStatus_1.HttpStatus.OK).json((0, apiResponse_utils_1.default)(true, { message: "Eliminado" }));
    }
    catch (error) {
        return next(error);
    }
};
// INDUSTRIES
AdminController.listIndustries = async (req, res, next) => {
    try {
        const result = await _a.service.listIndustries();
        res.status(HttpStatus_1.HttpStatus.OK).json((0, apiResponse_utils_1.default)(true, result));
    }
    catch (error) {
        return next(error);
    }
};
AdminController.createIndustry = async (req, res, next) => {
    try {
        const dto = validator_1.createIndustrySchema.parse(req.body);
        const created = await _a.service.createIndustry(dto);
        res.status(HttpStatus_1.HttpStatus.CREATED).json((0, apiResponse_utils_1.default)(true, created));
    }
    catch (error) {
        return next(error);
    }
};
AdminController.getIndustryById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const entity = await _a.service.getIndustryById(id);
        res.status(HttpStatus_1.HttpStatus.OK).json((0, apiResponse_utils_1.default)(true, entity));
    }
    catch (error) {
        return next(error);
    }
};
AdminController.updateIndustry = async (req, res, next) => {
    try {
        const { id } = req.params;
        const dto = validator_1.updateIndustrySchema.parse(req.body);
        const updated = await _a.service.updateIndustry(id, dto);
        res.status(HttpStatus_1.HttpStatus.OK).json((0, apiResponse_utils_1.default)(true, updated));
    }
    catch (error) {
        return next(error);
    }
};
AdminController.deleteIndustry = async (req, res, next) => {
    try {
        const { id } = req.params;
        await _a.service.deleteIndustry(id);
        res.status(HttpStatus_1.HttpStatus.OK).json((0, apiResponse_utils_1.default)(true, { message: "Eliminado" }));
    }
    catch (error) {
        return next(error);
    }
};
// CREDIT APPLICATIONS MANAGEMENT
AdminController.getCreditApplicationsForAdmin = async (req, res, next) => {
    try {
        const { page, limit, status, companyName } = req.query;
        const result = await _a.loanService.getCreditApplicationsForAdmin(page, limit, status, companyName);
        res.status(HttpStatus_1.HttpStatus.OK).json((0, apiResponse_utils_1.default)(true, result));
    }
    catch (error) {
        return next(error);
    }
};
AdminController.updateCreditApplicationStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const adminUserId = res.locals.user?.id;
        const { newStatus, rejectionReason, internalNotes, userNotes, approvedAmount, riskScore, } = req.body;
        const result = await _a.loanService.updateCreditApplicationStatus(id, newStatus, adminUserId, rejectionReason, internalNotes, userNotes, approvedAmount, riskScore);
        res.status(HttpStatus_1.HttpStatus.OK).json((0, apiResponse_utils_1.default)(true, result));
    }
    catch (error) {
        return next(error);
    }
};
AdminController.getCreditApplicationByIdForAdmin = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await _a.loanService.getCreditApplicationByIdForAdmin(id);
        res.status(HttpStatus_1.HttpStatus.OK).json((0, apiResponse_utils_1.default)(true, result));
    }
    catch (error) {
        return next(error);
    }
};
AdminController.getDashboardStats = async (req, res, next) => {
    try {
        const result = await _a.loanService.getDashboardStats();
        res.status(HttpStatus_1.HttpStatus.OK).json((0, apiResponse_utils_1.default)(true, result));
    }
    catch (error) {
        return next(error);
    }
};
AdminController.getAllowedStatusTransitions = async (req, res, next) => {
    try {
        const { id } = req.params;
        const application = await _a.loanService.getCreditApplicationByIdForAdmin(id);
        const currentStatus = application.status;
        const allowedTransitions = CreditStatus_1.ALLOWED_STATUS_TRANSITIONS[currentStatus] || [];
        res.status(HttpStatus_1.HttpStatus.OK).json((0, apiResponse_utils_1.default)(true, {
            currentStatus,
            allowedTransitions
        }));
    }
    catch (error) {
        return next(error);
    }
};
exports.default = AdminController;
