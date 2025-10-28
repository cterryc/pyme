"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const data_source_1 = require("../../config/data-source");
const HttpError_utils_1 = __importDefault(require("../../utils/HttpError.utils"));
const HttpStatus_1 = require("../../constants/HttpStatus");
const Company_entity_1 = require("../../entities/Company.entity");
const dto_1 = require("./dto");
const Industry_entity_1 = require("../../entities/Industry.entity");
const User_entity_1 = require("../../entities/User.entity");
const System_config_entity_1 = require("../../entities/System_config.entity");
const CreditApplication_entity_1 = require("../../entities/CreditApplication.entity");
const CreditStatus_1 = require("../../constants/CreditStatus");
class CompanyService {
    constructor() {
        this.companyRepo = data_source_1.AppDataSource.getRepository(Company_entity_1.Company);
        this.industryRepo = data_source_1.AppDataSource.getRepository(Industry_entity_1.Industry);
        this.userRepo = data_source_1.AppDataSource.getRepository(User_entity_1.User);
        this.systemConfigRepo = data_source_1.AppDataSource.getRepository(System_config_entity_1.SystemConfig);
        this.creditApplicationRepo = data_source_1.AppDataSource.getRepository(CreditApplication_entity_1.CreditApplication);
    }
    async getSystemLimits() {
        const limits = {};
        try {
            const maxRevenueConfig = await this.systemConfigRepo.findOne({
                where: { key: 'MAX_ANNUAL_REVENUE' }
            });
            const maxEmployeeConfig = await this.systemConfigRepo.findOne({
                where: { key: 'MAX_EMPLOYEE_COUNT' }
            });
            if (maxRevenueConfig) {
                limits.maxAnnualRevenue = maxRevenueConfig.value;
            }
            if (maxEmployeeConfig) {
                limits.maxEmployeeCount = maxEmployeeConfig.value;
            }
        }
        catch (error) {
            console.warn('Error obteniendo límites del sistema:', error);
        }
        return limits;
    }
    async validateCompanyLimits(annualRevenue, employeeCount) {
        const limits = await this.getSystemLimits();
        const reasons = [];
        let exceedsLimits = false;
        const maxRevenue = limits.maxAnnualRevenue ?? 50000000; // 50M por defecto
        const maxEmployees = limits.maxEmployeeCount ?? 250; // 250 empleados por defecto
        if (annualRevenue > maxRevenue) {
            exceedsLimits = true;
            reasons.push(`Los ingresos anuales (${annualRevenue}) superan el límite permitido (${maxRevenue})`);
        }
        if (employeeCount > maxEmployees) {
            exceedsLimits = true;
            reasons.push(`La cantidad de empleados (${employeeCount}) supera el límite permitido (${maxEmployees})`);
        }
        return { exceedsLimits, reasons };
    }
    async createCreditApplicationWithNotApplicableStatus(companyId, reasons) {
        try {
            const applicationNumber = `APP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const creditApplication = this.creditApplicationRepo.create({
                applicationNumber,
                company: { id: companyId },
                status: CreditStatus_1.CreditApplicationStatus.NOT_APPLICABLE,
                rejectionReason: `No aplica: ${reasons.join(', ')}`,
                statusHistory: [{
                        status: CreditStatus_1.CreditApplicationStatus.NOT_APPLICABLE,
                        timestamp: new Date(),
                        reason: `No aplica: ${reasons.join(', ')}`
                    }]
            });
            await this.creditApplicationRepo.save(creditApplication);
        }
        catch (error) {
            console.error('Error creando solicitud de crédito con estado no aplica:', error);
        }
    }
    async createCompany(companyData, ownerUserId) {
        const userExists = await this.userRepo.findOne({
            where: { id: ownerUserId },
        });
        if (!userExists) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.NOT_FOUND, "Usuario no encontrado.");
        }
        const whereConditions = [
            { taxId: companyData.taxId },
        ];
        if (companyData.email) {
            whereConditions.push({ email: companyData.email });
        }
        const exists = await this.companyRepo.findOne({
            where: whereConditions,
        });
        if (exists) {
            if (exists.taxId === companyData.taxId) {
                throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.BAD_REQUEST, "La compañía con ese RUC/taxId ya fue registrada.");
            }
            if (companyData.email && exists.email === companyData.email) {
                throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.BAD_REQUEST, "El correo electrónico ya está asociado a otra compañía.");
            }
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.BAD_REQUEST, "La compañía ya existe.");
        }
        const industry = await this.industryRepo.findOne({
            where: { id: companyData.industryId },
        });
        if (!industry) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.BAD_REQUEST, "La industria especificada con ese ID no existe.");
        }
        const validation = await this.validateCompanyLimits(companyData.annualRevenue, companyData.employeeCount);
        const newCompany = this.companyRepo.create({
            ...companyData,
            owner: { id: ownerUserId },
            industry: industry,
        });
        const savedCompany = await this.companyRepo.save(newCompany);
        if (validation.exceedsLimits) {
            await this.createCreditApplicationWithNotApplicableStatus(savedCompany.id, validation.reasons);
        }
        // Recargar la company con las relaciones para el DTO
        const companyWithRelations = await this.companyRepo.findOne({
            where: { id: savedCompany.id },
            relations: ["industry", "creditApplications"],
        });
        return (0, dto_1.toCompanyDto)(companyWithRelations);
    }
    async listCompaniesByUserId(userId) {
        const companies = await this.companyRepo.find({
            where: { owner: { id: userId }, deletedAt: (0, typeorm_1.IsNull)() },
            order: { createdAt: "DESC" },
            relations: ["documents", "industry", "creditApplications", "owner"],
        });
        return (0, dto_1.toCompanyListDto)(companies);
    }
    async getCompanyById(companyId, userId) {
        const company = await this.companyRepo.findOne({
            where: { id: companyId, owner: { id: userId } },
            relations: ["industry", "creditApplications"],
        });
        if (!company) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.NOT_FOUND, "La compania no existe.");
        }
        return (0, dto_1.toCompanyDto)(company);
    }
    async updateCompany(companyId, companyData, userId) {
        const company = await this.companyRepo.findOne({
            where: { id: companyId, owner: { id: userId } },
        });
        if (!company) {
            return null;
        }
        const whereConditions = [];
        if (companyData.taxId && companyData.taxId !== company.taxId) {
            whereConditions.push({ taxId: companyData.taxId });
        }
        if (companyData.email && companyData.email !== company.email) {
            whereConditions.push({ email: companyData.email });
        }
        if (whereConditions.length > 0) {
            const isDuplicated = await this.companyRepo.findOne({
                where: whereConditions.map((condition) => ({
                    ...condition,
                    id: (0, typeorm_1.Not)(companyId),
                })),
            });
            if (isDuplicated) {
                if (isDuplicated.taxId === companyData.taxId) {
                    throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.BAD_REQUEST, "El RUC/taxId ya pertenece a otra compañía.");
                }
                if (isDuplicated.email === companyData.email) {
                    throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.BAD_REQUEST, "El correo electrónico ya está en uso por otra compañía.");
                }
            }
        }
        if (companyData.industryId !== undefined) {
            if (companyData.industryId === null) {
                company.industry = undefined;
            }
            else {
                const industry = await this.industryRepo.findOne({
                    where: { id: companyData.industryId },
                });
                if (!industry) {
                    throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.BAD_REQUEST, "La industria especificada con ese ID no existe.");
                }
                company.industry = industry;
            }
            const { industryId: _industryId, ...restData } = companyData;
            this.companyRepo.merge(company, restData);
        }
        else {
            this.companyRepo.merge(company, companyData);
        }
        return this.companyRepo.save(company);
    }
    async deleteCompanyByUser(companyId, userId) {
        const company = await this.companyRepo.findOne({
            where: { id: companyId, owner: { id: userId } },
        });
        if (!company) {
            return null;
        }
        await this.companyRepo.softDelete({ id: company.id });
        return company;
    }
    async getIndustries() {
        const industries = await this.industryRepo.find({
            order: { name: "ASC" },
        });
        return (0, dto_1.toIndustryListDto)(industries);
    }
    async getAllCompanies(query) {
        const { page, limit, industryId, status, deleted, search, createdAtFrom, createdAtTo, foundedDateFrom, foundedDateTo, sortBy, sortOrder, } = query;
        // Construir WHERE conditions
        const whereConditions = {};
        // Filtro de eliminados
        if (deleted === "true") {
            whereConditions.deletedAt = (0, typeorm_1.Not)((0, typeorm_1.IsNull)());
        }
        else if (deleted === "false") {
            whereConditions.deletedAt = (0, typeorm_1.IsNull)();
        }
        // Si deleted === 'all', no agregamos filtro
        // Filtro por industria
        if (industryId) {
            whereConditions.industry = { id: industryId };
        }
        // Búsqueda por legalName o taxId
        const searchConditions = [];
        if (search) {
            searchConditions.push({ ...whereConditions, legalName: (0, typeorm_1.ILike)(`%${search}%`) }, { ...whereConditions, taxId: (0, typeorm_1.ILike)(`%${search}%`) });
        }
        // Filtro por rango de createdAt
        if (createdAtFrom && createdAtTo) {
            whereConditions.createdAt = (0, typeorm_1.Between)(createdAtFrom, createdAtTo);
        }
        else if (createdAtFrom) {
            whereConditions.createdAt = (0, typeorm_1.MoreThanOrEqual)(createdAtFrom);
        }
        else if (createdAtTo) {
            whereConditions.createdAt = (0, typeorm_1.LessThanOrEqual)(createdAtTo);
        }
        // Filtro por rango de foundedDate
        if (foundedDateFrom && foundedDateTo) {
            whereConditions.foundedDate = (0, typeorm_1.Between)(foundedDateFrom, foundedDateTo);
        }
        else if (foundedDateFrom) {
            whereConditions.foundedDate = (0, typeorm_1.MoreThanOrEqual)(foundedDateFrom);
        }
        else if (foundedDateTo) {
            whereConditions.foundedDate = (0, typeorm_1.LessThanOrEqual)(foundedDateTo);
        }
        // Construir query builder para filtro complejo de status
        const queryBuilder = this.companyRepo
            .createQueryBuilder("company")
            .leftJoinAndSelect("company.industry", "industry")
            .leftJoinAndSelect("company.documents", "documents")
            .leftJoinAndSelect("company.creditApplications", "creditApplications")
            .withDeleted(); // Incluye soft deleted para poder filtrarlos
        // Aplicar whereConditions básicos
        if (searchConditions.length > 0) {
            searchConditions.forEach((condition, index) => {
                if (index === 0) {
                    queryBuilder.where(condition);
                }
                else {
                    queryBuilder.orWhere(condition);
                }
            });
        }
        else {
            queryBuilder.where(whereConditions);
        }
        // Filtro por status de creditApplications
        if (status) {
            queryBuilder.andWhere("creditApplications.status = :status", { status });
        }
        // Ordenamiento
        const orderField = sortBy === "legalName" ? "company.legalName" : "company.createdAt";
        queryBuilder.orderBy(orderField, sortOrder);
        // Paginación
        const skip = (page - 1) * limit;
        queryBuilder.skip(skip).take(limit);
        // Ejecutar query
        const [companies, total] = await queryBuilder.getManyAndCount();
        // Transformar a DTO
        const companiesDto = (0, dto_1.toAdminCompanyListDto)(companies);
        return (0, dto_1.createPaginatedResponse)(companiesDto, total, page, limit);
    }
}
exports.default = CompanyService;
//# sourceMappingURL=service.js.map