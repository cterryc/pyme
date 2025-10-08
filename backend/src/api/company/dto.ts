import { Company } from '../../entities/Company.entity';
import { responseCompanyDto } from './interface';

/**
 * Convierte una entidad Company de la DB a un DTO de respuesta seguro.
 */
export function toCompanyDto(company: Company): responseCompanyDto {
    return {
        id: company.id,
        legalName: company.legalName,
        tradeName: company.tradeName,
        phone: company.phone,
        email: company.email,
        taxId: company.taxId,
        ownerId: company.ownerId,
        industry: company.industry,
        foundedDate: company.foundedDate,
        employeeCount: company.employeeCount,
        annualRevenue: company.annualRevenue,
        address: company.address,
        city: company.city,
        state: company.state,
        postalCode: company.postalCode,
        country: company.country,
        website: company.website,
        description: company.description,
    };
}

/**
 * Opcional: Para transformar listas
 */
export function toCompanyListDto(companies: Company[]): responseCompanyDto[] {
    return companies.map(toCompanyDto);
}