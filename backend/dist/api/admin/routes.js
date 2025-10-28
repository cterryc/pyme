"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = __importDefault(require("./controller"));
const authenticate_middleware_1 = __importDefault(require("../../middlewares/authenticate.middleware"));
const authorization_middleware_1 = __importDefault(require("../../middlewares/authorization.middleware"));
const Roles_1 = require("../../constants/Roles");
const schemaValidators_middlewares_1 = __importDefault(require("../../middlewares/schemaValidators.middlewares"));
const validateParamId_middleware_1 = require("../../middlewares/validateParamId.middleware");
const validator_1 = require("./validator");
const validator_2 = require("../loan/validator");
const adminRouter = (0, express_1.Router)();
adminRouter.use(authenticate_middleware_1.default, (0, authorization_middleware_1.default)([Roles_1.UserRole.ADMIN, Roles_1.UserRole.OWNER]));
adminRouter.get("/systemconfig", controller_1.default.listSystemConfigs);
adminRouter.post("/systemconfig", (0, schemaValidators_middlewares_1.default)(validator_1.createSystemConfigSchema, null), controller_1.default.createSystemConfig);
adminRouter.get("/systemconfig/:id", validateParamId_middleware_1.validateUuid, controller_1.default.getSystemConfigById);
adminRouter.patch("/systemconfig/:id", validateParamId_middleware_1.validateUuid, (0, schemaValidators_middlewares_1.default)(validator_1.updateSystemConfigSchema, null), controller_1.default.updateSystemConfig);
adminRouter.delete("/systemconfig/:id", validateParamId_middleware_1.validateUuid, controller_1.default.deleteSystemConfig);
adminRouter.get("/risktier", controller_1.default.listRiskTierConfigs);
adminRouter.post("/risktier", (0, schemaValidators_middlewares_1.default)(validator_1.createRiskTierConfigSchema, null), controller_1.default.createRiskTierConfig);
adminRouter.get("/risktier/:id", validateParamId_middleware_1.validateUuid, controller_1.default.getRiskTierConfigById);
adminRouter.patch("/risktier/:id", validateParamId_middleware_1.validateUuid, (0, schemaValidators_middlewares_1.default)(validator_1.updateRiskTierConfigSchema, null), controller_1.default.updateRiskTierConfig);
adminRouter.delete("/risktier/:id", validateParamId_middleware_1.validateUuid, controller_1.default.deleteRiskTierConfig);
// INDUSTRIES
adminRouter.get("/industries", controller_1.default.listIndustries);
adminRouter.post("/industries", (0, schemaValidators_middlewares_1.default)(validator_1.createIndustrySchema, null), controller_1.default.createIndustry);
adminRouter.get("/industries/:id", validateParamId_middleware_1.validateUuid, controller_1.default.getIndustryById);
adminRouter.patch("/industries/:id", validateParamId_middleware_1.validateUuid, (0, schemaValidators_middlewares_1.default)(validator_1.updateIndustrySchema, null), controller_1.default.updateIndustry);
adminRouter.delete("/industries/:id", validateParamId_middleware_1.validateUuid, controller_1.default.deleteIndustry);
// CREDIT APPLICATIONS MANAGEMENT
adminRouter.get("/dashboard/stats", controller_1.default.getDashboardStats);
adminRouter.get("/credit-applications", (0, schemaValidators_middlewares_1.default)(null, validator_2.getCreditApplicationsForAdminQuerySchema), controller_1.default.getCreditApplicationsForAdmin);
adminRouter.get("/credit-applications/:id", validateParamId_middleware_1.validateUuid, controller_1.default.getCreditApplicationByIdForAdmin);
adminRouter.get("/credit-applications/:id/allowed-transitions", validateParamId_middleware_1.validateUuid, controller_1.default.getAllowedStatusTransitions);
adminRouter.patch("/credit-applications/:id/status", validateParamId_middleware_1.validateUuid, (0, schemaValidators_middlewares_1.default)(validator_2.updateCreditApplicationStatusBodySchema, null), controller_1.default.updateCreditApplicationStatus);
exports.default = adminRouter;
//# sourceMappingURL=routes.js.map