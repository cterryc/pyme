import { CreditApplicationStatus } from '../../constants/CreditStatus';
import { Company } from '../../entities/Company.entity';
import { responseCompanyDto } from './interface';
import { responseAdminCompanyDto, PaginatedResponse } from './interface';

/**
 * Convierte una entidad Company de la DB a un DTO de respuesta seguro.
 */
export function toCompanyDto(company: Company): responseCompanyDto {
    
    let statusCredit = CreditApplicationStatus.DRAFT;
    
    if (company.creditApplications && company.creditApplications.length > 0) {
        
        const notApplicableApplication = company.creditApplications.find(
            app => app.status === CreditApplicationStatus.NOT_APPLICABLE
        );
        
        if (notApplicableApplication) {
            statusCredit = CreditApplicationStatus.NOT_APPLICABLE;
        } else {
           
            const sortedApplications = company.creditApplications.sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
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
export function toCompanyListDto(companies: Company[]): responseCompanyDto[] {
    return companies.map(toCompanyDto);
}


export function toIndustryDto(industry: any): any {
    return {
        id: industry.id,
        name: industry.name,
    };
}


export function toIndustryListDto(industries: any[]): any[] {
    return industries.map(toIndustryDto);
}

/**
 * DTO optimizado para listado de administrador (sin info del owner)
 */
export function toAdminCompanyDto(company: Company): responseAdminCompanyDto {
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
        city: company.city,
        state: company.state,
        country: company.country,
        phone: company.phone,
        statusCredit: company.creditApplications && company.creditApplications.length > 0
            ? (() => {
                
                const notApplicableApplication = company.creditApplications.find(
                    app => app.status === CreditApplicationStatus.NOT_APPLICABLE
                );
                
                if (notApplicableApplication) {
                    return CreditApplicationStatus.NOT_APPLICABLE;
                } else {
                  
                    const sortedApplications = company.creditApplications.sort(
                        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    );
                    return sortedApplications[0].status;
                }
              })()
            : CreditApplicationStatus.DRAFT,
        hasDocuments: company.documents ? company.documents.length > 0 : false,
        createdAt: company.createdAt,
        deletedAt: company.deletedAt,
    };
}

/**
 * Transforma lista de companies para admin
 */
export function toAdminCompanyListDto(companies: Company[]): responseAdminCompanyDto[] {
    return companies.map(toAdminCompanyDto);
}

/**
 * Crea respuesta paginada
 */
export function createPaginatedResponse<T>(
    data: T[],
    total: number,
    page: number,
    limit: number
): PaginatedResponse<T> {
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