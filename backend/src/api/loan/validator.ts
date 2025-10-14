import { z } from "zod";

export const loanRequestSchema = z
  .object({
    companyId: z.string().uuid({ message: "ID de pyme inválido" }),
  })
  .strict();

export const createCreditApplicationSchema = z
  .object({
    id: z.string().uuid({ message: "ID de solicitud inválido" }),
    companyId: z.string().uuid({ message: "ID de compañía inválido" }),
    amount: z
      .number()
      .positive({ message: "Monto solicitado debe ser mayor a 0" }),
    paymentNumber: z
      .number()
      .int()
      .positive({ message: "Cuotas deben ser un número positivo" })
      .default(12),
  })
  .strict({message: "Faltan campos requeridos o hay campos extra"});

export type LoanRequestInput = z.infer<typeof loanRequestSchema>;
export type CreateCreditApplicationInput = z.infer<
  typeof createCreditApplicationSchema
>;
