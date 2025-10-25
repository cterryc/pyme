import { z } from "zod";
import { RiskTier } from "../../constants/RiskTier";
import { CreditApplicationStatus } from "../../constants/CreditStatus";

 export const createSystemConfigSchema = z
   .object({
     key: z.string().min(1).max(100)
       .refine((val) => val.trim().length > 0, {
         message: "La clave no puede contener solo espacios en blanco",
       }),
     value: z.coerce.number()
       .refine((val) => !isNaN(val) && isFinite(val), {
         message: "El valor debe ser un número válido",
       }),
     description: z.string().trim().optional().or(z.literal('')),
   })
   .strict();

 export const updateSystemConfigSchema = createSystemConfigSchema.partial();

 export const createRiskTierConfigSchema = z
   .object({
     tier: z.nativeEnum(RiskTier),
     spread: z.coerce.number()
       .min(0, { message: "El spread no puede ser negativo" })
       .refine((val) => !isNaN(val) && isFinite(val), {
         message: "El spread debe ser un número válido",
       }),
     factor: z.coerce.number()
       .min(0, { message: "El factor no puede ser negativo" })
       .refine((val) => !isNaN(val) && isFinite(val), {
         message: "El factor debe ser un número válido",
       }),
     allowed_terms: z.array(z.coerce.number().int().positive()).nonempty(),
   })
   .strict();

 export const updateRiskTierConfigSchema = createRiskTierConfigSchema.partial();

 export const idParamSchema = z.string().uuid({ message: "ID inválido" });

 export type CreateSystemConfigInput = z.infer<typeof createSystemConfigSchema>;
 export type UpdateSystemConfigInput = z.infer<typeof updateSystemConfigSchema>;
 export type CreateRiskTierConfigInput = z.infer<
   typeof createRiskTierConfigSchema
 >;
 export type UpdateRiskTierConfigInput = z.infer<
   typeof updateRiskTierConfigSchema
 >;
 export type IdParam = z.infer<typeof idParamSchema>;

// Industry validators
export const createIndustrySchema = z
  .object({
    name: z
      .string()
      .min(1)
      .max(100)
      .refine((val) => val.trim().length > 0, {
        message: "El nombre no puede contener solo espacios en blanco",
      })
      .transform((v) => v.toLowerCase()),
    baseRiskTier: z.nativeEnum(RiskTier),
    description: z.string().trim().optional().or(z.literal('')),
  })
  .strict();

export const updateIndustrySchema = createIndustrySchema.partial();

export type CreateIndustryInput = z.infer<typeof createIndustrySchema>;
export type UpdateIndustryInput = z.infer<typeof updateIndustrySchema>;

// Credit Application Management Validators
export const updateCreditApplicationStatusSchema = z
  .object({
    newStatus: z.nativeEnum(CreditApplicationStatus),
    rejectionReason: z.string()
      .refine((val) => !val || val.trim().length > 0, {
        message: "La razón de rechazo no puede contener solo espacios en blanco",
      })
      .optional(),
    internalNotes: z.string()
      .refine((val) => !val || val.trim().length > 0, {
        message: "Las notas internas no pueden contener solo espacios en blanco",
      })
      .optional(),
    approvedAmount: z.coerce.number()
      .positive({ message: "El monto aprobado debe ser mayor a 0" })
      .refine((val) => !isNaN(val) && isFinite(val), {
        message: "El monto aprobado debe ser un número válido",
      })
      .optional(),
    riskScore: z.coerce.number()
      .min(0, { message: "El score de riesgo no puede ser negativo" })
      .max(100, { message: "El score de riesgo no puede ser mayor a 100" })
      .refine((val) => !isNaN(val) && isFinite(val), {
        message: "El score de riesgo debe ser un número válido",
      })
      .optional(),
  })
  .strict()
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
  );

export type UpdateCreditApplicationStatusInput = z.infer<
  typeof updateCreditApplicationStatusSchema
>;
