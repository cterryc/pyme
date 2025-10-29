export interface responseCompanyDto {
    id: string;
    legalName: string;
    tradeName?: string;
    taxId: string;
    email?: string;
    industryId?: string;
    industryName?: string;
    foundedDate?: Date;
    employeeCount?: number;
    annualRevenue?: number;
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    phone?: string;
    website?: string;
    description?: string;
    statusCredit: string;
    hasDocuments: boolean;
}



export interface responseIndustryDto {
    id: string;
    name: string;
    description?: string;
}

// Agregar al final del archivo interface.ts existente

export interface responseAdminCompanyDto {
    id: string;
    legalName: string;
    tradeName?: string;
    taxId: string;
    email?: string;
    industryName?: string;
    foundedDate?: Date;
    employeeCount?: number;
    annualRevenue?: number;
    postalCode?: string;
    website?: string;
    description?: string;
    city?: string;
    address?: string;
    state?: string;
    country?: string;
    phone?: string;
    statusCredit: string;
    hasDocuments: boolean;
    createdAt: Date;
    deletedAt?: Date;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}