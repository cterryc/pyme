export interface responseCompanyDto {
    legalName: string;
    tradeName?: string;
    phone?: string;
    email?: string;
    taxId: string;
    ownerId: string; 
    industry?: string;
    foundedDate?: Date;
    employeeCount?: number;
    annualRevenue?: number;
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    website?: string;
    description?: string;
}
