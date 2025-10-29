"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCompanyDto = toCompanyDto;
exports.toCompanyListDto = toCompanyListDto;
exports.toIndustryDto = toIndustryDto;
exports.toIndustryListDto = toIndustryListDto;
exports.toAdminCompanyDto = toAdminCompanyDto;
exports.toAdminCompanyListDto = toAdminCompanyListDto;
exports.createPaginatedResponse = createPaginatedResponse;
const CreditStatus_1 = require("../../constants/CreditStatus");
/**
 * Convierte una entidad Company de la DB a un DTO de respuesta seguro.
 */
function toCompanyDto(company) {
    let statusCredit = CreditStatus_1.CreditApplicationStatus.DRAFT;
    if (company.creditApplications && company.creditApplications.length > 0) {
        const notApplicableApplication = company.creditApplications.find(app => app.status === CreditStatus_1.CreditApplicationStatus.NOT_APPLICABLE);
        if (notApplicableApplication) {
            statusCredit = CreditStatus_1.CreditApplicationStatus.NOT_APPLICABLE;
        }
        else {
            const sortedApplications = company.creditApplications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            statusCredit = sortedApplications[0].status;
        }
    }
    return {
        id: company.id,
        legalName: company.legalName,
        tradeName: company.tradeName,
        taxId: company.taxId,
        email: company.email,
        industryId: company.industry?.id,
        industryName: company.industry?.name,
        foundedDate: company.foundedDate,
        employeeCount: company.employeeCount,
        annualRevenue: company.annualRevenue,
        address: company.address,
        city: company.city,
        state: company.state,
        postalCode: company.postalCode,
        country: company.country,
        phone: company.phone,
        website: company.website,
        description: company.description,
        statusCredit,
        hasDocuments: company.documents && company.documents.length > 0
            ? true
            : false,
    };
}
/**
 * Opcional: Para transformar listas
 */
function toCompanyListDto(companies) {
    return companies.map(toCompanyDto);
}
function toIndustryDto(industry) {
    return {
        id: industry.id,
        name: industry.name,
    };
}
function toIndustryListDto(industries) {
    return industries.map(toIndustryDto);
}
/**
 * DTO optimizado para listado de administrador (sin info del owner)
 */
function toAdminCompanyDto(company) {
    return {
        id: company.id,
        legalName: company.legalName,
        tradeName: company.tradeName,
        taxId: company.taxId,
        email: company.email,
        industryName: company.industry?.name,
        foundedDate: company.foundedDate,
        employeeCount: company.employeeCount,
        annualRevenue: company.annualRevenue,
        address: company.address,
        website: company.website,
        postalCode: company.postalCode,
        description: company.description,
        city: company.city,
        state: company.state,
        country: company.country,
        phone: company.phone,
        statusCredit: company.creditApplications && company.creditApplications.length > 0
            ? (() => {
                const notApplicableApplication = company.creditApplications.find(app => app.status === CreditStatus_1.CreditApplicationStatus.NOT_APPLICABLE);
                if (notApplicableApplication) {
                    return CreditStatus_1.CreditApplicationStatus.NOT_APPLICABLE;
                }
                else {
                    const sortedApplications = company.creditApplications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                    return sortedApplications[0].status;
                }
            })()
            : CreditStatus_1.CreditApplicationStatus.DRAFT,
        hasDocuments: company.documents ? company.documents.length > 0 : false,
        createdAt: company.createdAt,
        deletedAt: company.deletedAt,
    };
}
/**
 * Transforma lista de companies para admin
 */
function toAdminCompanyListDto(companies) {
    return companies.map(toAdminCompanyDto);
}
/**
 * Crea respuesta paginada
 */
function createPaginatedResponse(data, total, page, limit) {
    return {
        data,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
}
