import { z } from "zod";

export const createCompanySchema = z.object({
  legalName: z.string().min(1, { message: 'Nombre legal requerido' }).max(255),
  tradeName: z.string().optional(),
  industryId: z.string().uuid({ message: 'ID de industria inválido' }),
  taxId: z.string().min(1, { message: 'Tax ID requerido' }).max(50), 
  email: z.string().email({ message: 'Email inválido' }).optional(),
  foundedDate: z.coerce.date().optional(),  
  employeeCount: z.number().int().min(0).optional(),
  annualRevenue: z.number().min(0).optional(),  
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().url({ message: 'URL inválida' }).optional(),
  description: z.string().optional(),
}).strict();

export const updateCompanySchema = createCompanySchema.partial(); 

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;