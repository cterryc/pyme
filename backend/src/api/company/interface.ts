export interface responseCompanyDto {
    id: string;
    legalName: string;
    industryName?: string;
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
    city?: string;
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