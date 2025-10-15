import { Company } from '../../entities/Company.entity';
import { responseCompanyDto } from './interface';

/**
 * Convierte una entidad Company de la DB a un DTO de respuesta seguro.
 */
export function toCompanyDto(company: Company): responseCompanyDto {
    return {
        id: company.id,
        legalName: company.legalName,
        ownerName: company.owner?.firstName,
        industryName: company.industry?.name,
        ownerSurname: company.owner?.lastName,
        statusCredit: company.creditApplications && company.creditApplications.length > 0
            ? company.creditApplications[0].status
            : 'No aplica',
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