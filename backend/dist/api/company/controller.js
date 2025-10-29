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
class CompanyController {
}
_a = CompanyController;
CompanyController.companyService = new service_1.default();
CompanyController.createCompany = async (req, res, next) => {
    try {
        const dto = validator_1.createCompanySchema.parse(req.body);
        const userId = res.locals.user?.id;
        const newCompany = await _a.companyService.createCompany(dto, userId);
        res.status(HttpStatus_1.HttpStatus.CREATED).json((0, apiResponse_utils_1.default)(true, newCompany));
    }
    catch (error) {
        return next(error);
    }
};
CompanyController.getCompanyById = async (req, res, next) => {
    try {
        const companyId = req.params.id;
        const userId = res.locals.user?.id;
        const company = await _a.companyService.getCompanyById(companyId, userId);
        res.status(HttpStatus_1.HttpStatus.OK).json((0, apiResponse_utils_1.default)(true, company));
    }
    catch (error) {
        return next(error);
    }
};
CompanyController.updateCompany = async (req, res, next) => {
    try {
        const companyId = req.params.id;
        const dto = validator_1.updateCompanySchema.parse(req.body);
        const userId = res.locals.user?.id;
        const updatedCompany = await _a.companyService.updateCompany(companyId, dto, userId);
        if (!updatedCompany) {
            return res
                .status(HttpStatus_1.HttpStatus.NOT_FOUND)
                .json((0, apiResponse_utils_1.default)(false, { message: "La compañía no existe." }));
        }
        res.status(HttpStatus_1.HttpStatus.OK).json((0, apiResponse_utils_1.default)(true, updatedCompany));
    }
    catch (error) {
        return next(error);
    }
};
CompanyController.deleteCompanyByUser = async (req, res, next) => {
    try {
        const companyId = req.params.id;
        const userId = res.locals.user?.id;
        const deletedCompany = await _a.companyService.deleteCompanyByUser(companyId, userId);
        if (!deletedCompany) {
            return res
                .status(HttpStatus_1.HttpStatus.NOT_FOUND)
                .json((0, apiResponse_utils_1.default)(false, { message: "La compañía no existe." }));
        }
        return res
            .status(HttpStatus_1.HttpStatus.OK)
            .json((0, apiResponse_utils_1.default)(true, { message: "Compañía eliminada con éxito." }));
    }
    catch (error) {
        return next(error);
    }
};
CompanyController.listCompaniesByUserId = async (req, res, next) => {
    try {
        const userId = res.locals.user.id;
        const companies = await _a.companyService.listCompaniesByUserId(userId);
        res.status(HttpStatus_1.HttpStatus.OK).json((0, apiResponse_utils_1.default)(true, companies));
    }
    catch (error) {
        return next(error);
    }
};
CompanyController.getIndustries = async (req, res, next) => {
    try {
        const industries = await _a.companyService.getIndustries();
        res.status(HttpStatus_1.HttpStatus.OK).json((0, apiResponse_utils_1.default)(true, industries));
    }
    catch (error) {
        return next(error);
    }
};
CompanyController.getAllCompanies = async (req, res, next) => {
    try {
        const query = validator_1.getAllCompaniesQuerySchema.parse(req.query);
        const result = await _a.companyService.getAllCompanies(query);
        res.status(HttpStatus_1.HttpStatus.OK).json((0, apiResponse_utils_1.default)(true, result));
    }
    catch (error) {
        return next(error);
    }
};
exports.default = CompanyController;
