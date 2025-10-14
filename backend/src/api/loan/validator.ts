import { z } from 'zod';

export const loanRequestSchema = z.object({
  companyId: z.string().uuid({ message: 'ID de pyme inválido' }),
}).strict();

export const createCreditApplicationSchema = z.object({
  companyId: z.string().uuid({ message: 'ID de compañía inválido' }),
  requestedAmount: z.number().positive({ message: 'Monto solicitado debe ser mayor a 0' }),
  termMonths: z.number().int().positive({ message: 'Cuotas deben ser un número positivo' }).default(12),
  purpose: z.enum(['EXPANSION', 'INVENTARIO', 'CAPITAL_DE_TRABAJO', 'OTRO'], { message: 'Propósito inválido' }),
  purposeDescription: z.string().optional(),    
}).strict();


export type LoanRequestInput = z.infer<typeof loanRequestSchema>;
export type CreateCreditApplicationInput = z.infer<typeof createCreditApplicationSchema>;