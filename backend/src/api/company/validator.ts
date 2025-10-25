import { z } from "zod";
import { CreditApplicationStatus } from "../../constants/CreditStatus";

// Validador para strings requeridos que no deben ser solo espacios
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

// Validador para strings opcionales que si se proporcionan no deben ser solo espacios
const optionalNonEmptyString = (maxLength?: number) => {
  let schema = z.string()
    .transform((val) => {
      // Convertir strings vacíos o solo con espacios a undefined
      if (!val || val.trim() === '') return undefined;
      return val.trim();
    })
    .optional();
  
  if (maxLength) {
    schema = schema.refine((val) => {
      if (!val) return true;
      return val.length <= maxLength;
    }, {
      message: `El campo no puede exceder ${maxLength} caracteres`,
    }) as any;
  }
  
  return schema;
};

export const createCompanySchema = z.object({
  legalName: nonEmptyString(1, 255),
  tradeName: optionalNonEmptyString(255),
  industryId: z.string().uuid({ message: 'ID de industria inválido' }),
  taxId: nonEmptyString(1, 50), 
  email: z.preprocess(
    (val) => {
      if (typeof val === 'string' && val.trim() === '') return undefined;
      return val;
    },
    z.string().email({ message: 'Email inválido' }).optional()
  ),
  foundedDate: z.coerce.date().optional(),  
  employeeCount: z.number()
    .int({ message: "El número de empleados debe ser un entero" })
    .min(0, { message: "El número de empleados no puede ser negativo" })
    .max(1000000, { message: "El número de empleados excede el máximo permitido" })
    .refine((val) => !isNaN(val) && isFinite(val), {
      message: "El número de empleados debe ser un número válido",
    }),
  annualRevenue: z.number()
    .min(0, { message: "Los ingresos anuales no pueden ser negativos" })
    .refine((val) => !isNaN(val) && isFinite(val), {
      message: "Los ingresos anuales deben ser un número válido",
    }),
  address: optionalNonEmptyString(500),
  city: optionalNonEmptyString(100),
  state: optionalNonEmptyString(100),
  postalCode: optionalNonEmptyString(20),
  country: optionalNonEmptyString(50),
  phone: optionalNonEmptyString(20),
  website: z.preprocess(
    (val) => {
      if (typeof val === 'string' && val.trim() === '') return undefined;
      return val;
    },
    z.string().url({ message: 'URL inválida' }).optional()
  ),
  description: optionalNonEmptyString(1000),
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