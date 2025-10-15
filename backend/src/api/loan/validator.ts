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
    selectedAmount: z
      .number()
      .positive({ message: "Monto seleccionado debe ser mayor a 0" }),
    selectedTermMonths: z
      .number()
      .int()
      .min(1, { message: "El plazo seleccionado debe ser al menos 1 mes" }),
  })
  .strict({message: "Faltan campos requeridos o hay campos extra"});

export type LoanRequestInput = z.infer<typeof loanRequestSchema>;
export type CreateCreditApplicationInput = z.infer<
  typeof createCreditApplicationSchema
>;
