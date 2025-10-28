"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = __importDefault(require("./controller"));
const schemaValidators_middlewares_1 = __importDefault(require("../../middlewares/schemaValidators.middlewares"));
const validator_1 = require("./validator");
const authenticate_middleware_1 = __importDefault(require("../../middlewares/authenticate.middleware"));
const validateParamId_middleware_1 = require("../../middlewares/validateParamId.middleware");
const authorization_middleware_1 = __importDefault(require("../../middlewares/authorization.middleware"));
const Roles_1 = require("../../constants/Roles");
const companyRouter = (0, express_1.Router)();
companyRouter.use(authenticate_middleware_1.default);
companyRouter.get("/all", (0, authorization_middleware_1.default)([Roles_1.UserRole.ADMIN]), controller_1.default.getAllCompanies);
companyRouter.get("/industries", controller_1.default.getIndustries);
// Protected routes
companyRouter.post("/", (0, schemaValidators_middlewares_1.default)(validator_1.createCompanySchema, null), controller_1.default.createCompany);
companyRouter.get("/", controller_1.default.listCompaniesByUserId);
companyRouter.get("/:id", validateParamId_middleware_1.validateUuid, controller_1.default.getCompanyById);
companyRouter.patch("/:id", validateParamId_middleware_1.validateUuid, (0, schemaValidators_middlewares_1.default)(validator_1.updateCompanySchema, null), controller_1.default.updateCompany);
companyRouter.delete("/:id", validateParamId_middleware_1.validateUuid, controller_1.default.deleteCompanyByUser);
exports.default = companyRouter;
//# sourceMappingURL=routes.js.map