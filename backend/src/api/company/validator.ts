import { z } from "zod";
import { CreditApplicationStatus } from "../../constants/CreditStatus";

export const createCompanySchema = z.object({
  legalName: z.string().min(1, { message: 'Nombre legal requerido' }).max(255),
  tradeName: z.string().optional(),
  industryId: z.string().uuid({ message: 'ID de industria inválido' }),
  taxId: z.string().min(1, { message: 'Tax ID requerido' }).max(50), 
  email: z.string().email({ message: 'Email inválido' }).optional(),
  foundedDate: z.coerce.date().optional(),  
  employeeCount: z.number().int().min(0),
  annualRevenue: z.number().min(0),  
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().url({ message: 'URL inválida' }).optional(),
  description: z.string().optional(),
}).strict();

export const getAllCompaniesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  
  // Filtros
  industryId: z.string().uuid().optional(),
  status: z.nativeEnum(CreditApplicationStatus).optional(),
  deleted: z.enum(['true', 'false', 'all']).optional().default('false'),
  
  // Búsqueda
  search: z.string().optional(), // Busca en legalName y taxId
  
  // Filtros de fecha - createdAt
  createdAtFrom: z.coerce.date().optional(),
  createdAtTo: z.coerce.date().optional(),
  
  // Filtros de fecha - foundedDate
  foundedDateFrom: z.coerce.date().optional(),
  foundedDateTo: z.coerce.date().optional(),
  
  // Ordenamiento
  sortBy: z.enum(['createdAt', 'legalName']).optional().default('createdAt'),
  sortOrder: z.enum(['ASC', 'DESC']).optional().default('DESC'),
}).strict();


export const updateCompanySchema = createCompanySchema.partial(); 

export type GetAllCompaniesQuery = z.infer<typeof getAllCompaniesQuerySchema>;
export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;