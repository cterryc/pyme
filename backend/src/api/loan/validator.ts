import { z } from "zod";
import { CreditApplicationStatus } from "../../constants/CreditStatus";

export const loanRequestSchema = z
  .object({
    companyId: z.string().uuid({ message: "ID de compañía inválido" }),
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
  .strict();

export const getCreditApplicationStatusParamsSchema = z
  .object({
    id: z.string().uuid({ message: "ID de solicitud inválido" }),
  })
  .strict();

export const listCreditApplicationsQuerySchema = z
  .object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 1))
      .refine((val) => val >= 1, { message: "Página debe ser mayor a 0" }),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 10))
      .refine((val) => val >= 1 && val <= 100, { 
        message: "Límite debe estar entre 1 y 100" 
      }),
    status: z
      .nativeEnum(CreditApplicationStatus)
      .optional(),
  })
  .strict();

export const getCreditApplicationByIdParamsSchema = z
  .object({
    id: z.string().uuid({ message: "ID de solicitud inválido" }),
  })
  .strict();

export const deleteCreditApplicationParamsSchema = z
  .object({
    id: z.string().uuid({ message: "ID de solicitud inválido" }),
  })
  .strict();


export const updateCreditApplicationStatusParamsSchema = z
  .object({
    id: z.string().uuid({ message: "ID de solicitud inválido" }),
  })
  .strict();

export const updateCreditApplicationStatusBodySchema = z
  .object({
    newStatus: z.nativeEnum(CreditApplicationStatus, {
      message: "Estado de solicitud inválido",
    }),
    rejectionReason: z
      .string()
      .min(1, { message: "Razón de rechazo no puede estar vacía" })
      .max(1000, { message: "Razón de rechazo muy larga" })
      .optional(),
    internalNotes: z
      .string()
      .max(2000, { message: "Notas internas muy largas" })
      .optional(),
    approvedAmount: z
      .number()
      .positive({ message: "Monto aprobado debe ser mayor a 0" })
      .optional(),
    riskScore: z
      .number()
      .min(0, { message: "Score de riesgo no puede ser negativo" })
      .max(100, { message: "Score de riesgo no puede ser mayor a 100" })
      .optional(),
  })
  .strict();

export const updateCreditApplicationStatusBodySchemaWithValidation = updateCreditApplicationStatusBodySchema
  .refine(
    (data) => {
      // Si el estado es REJECTED, se requiere rejectionReason
      if (data.newStatus === CreditApplicationStatus.REJECTED) {
        return data.rejectionReason && data.rejectionReason.trim().length > 0;
      }
      return true;
    },
    {
      message: "Se requiere una razón de rechazo cuando el estado es REJECTED",
      path: ["rejectionReason"],
    }
  )
  ;
export const getCreditApplicationsForAdminQuerySchema = z
  .object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 1))
      .refine((val) => val >= 1, { message: "Página debe ser mayor a 0" }),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 10))
      .refine((val) => val >= 1 && val <= 100, { 
        message: "Límite debe estar entre 1 y 100" 
      }),
    status: z
      .nativeEnum(CreditApplicationStatus)
      .optional(),
    companyName: z
      .string()
      .min(1, { message: "Nombre de compañía no puede estar vacío" })
      .max(255, { message: "Nombre de compañía muy largo" })
      .optional(),
  })
  .strict();

// Tipos TypeScript
export type LoanRequestInput = z.infer<typeof loanRequestSchema>;
export type CreateCreditApplicationInput = z.infer<typeof createCreditApplicationSchema>;
export type GetCreditApplicationStatusParams = z.infer<typeof getCreditApplicationStatusParamsSchema>;
export type ListCreditApplicationsQuery = z.infer<typeof listCreditApplicationsQuerySchema>;
export type GetCreditApplicationByIdParams = z.infer<typeof getCreditApplicationByIdParamsSchema>;
export type DeleteCreditApplicationParams = z.infer<typeof deleteCreditApplicationParamsSchema>;
export type UpdateCreditApplicationStatusParams = z.infer<typeof updateCreditApplicationStatusParamsSchema>;
export type UpdateCreditApplicationStatusBody = z.infer<typeof updateCreditApplicationStatusBodySchema>;
export type GetCreditApplicationsForAdminQuery = z.infer<typeof getCreditApplicationsForAdminQuerySchema>;
