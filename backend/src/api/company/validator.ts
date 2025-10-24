import { z } from "zod";
import { CreditApplicationStatus } from "../../constants/CreditStatus";

// Validador para strings que no deben ser solo espacios
const nonEmptyString = (minLength: number = 1, maxLength?: number) => {
  let schema = z.string()
    .min(minLength, { message: 'Campo requerido' })
    .refine((val) => val.trim().length > 0, {
      message: "El campo no puede contener solo espacios en blanco",
    });
  
  if (maxLength) {
    schema = schema.refine((val) => val.length <= maxLength, {
      message: `El campo no puede exceder ${maxLength} caracteres`,
    }) as any;
  }
  
  return schema;
};

export const createCompanySchema = z.object({
  legalName: nonEmptyString(1, 255),
  tradeName: z.string().trim().optional().or(z.literal('')),
  industryId: z.string().uuid({ message: 'ID de industria inválido' }),
  taxId: nonEmptyString(1, 50), 
  email: z.string().email({ message: 'Email inválido' }).optional().or(z.literal('')),
  foundedDate: z.coerce.date().optional(),  
  employeeCount: z.number().int().min(0),
  annualRevenue: z.number().min(0),  
  address: z.string().trim().optional().or(z.literal('')),
  city: z.string().trim().optional().or(z.literal('')),
  state: z.string().trim().optional().or(z.literal('')),
  postalCode: z.string().trim().optional().or(z.literal('')),
  country: z.string().trim().optional().or(z.literal('')),
  phone: z.string().trim().optional().or(z.literal('')),
  website: z.string().url({ message: 'URL inválida' }).optional().or(z.literal('')),
  description: z.string().trim().optional().or(z.literal('')),
}).strict();

export const getAllCompaniesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  
  // Filtros
  industryId: z.string().uuid().optional(),
  status: z.nativeEnum(CreditApplicationStatus).optional(),
  deleted: z.enum(['true', 'false', 'all']).optional().default('false'),
  
  // Búsqueda
  search: z.string().trim().min(1).optional(), // Busca en legalName y taxId
  
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