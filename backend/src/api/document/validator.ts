import { z } from "zod";
import { DocumentType, DocumentStatus } from "../../constants/CreditStatus";

export const uploadDocumentValidator = z.object({
  type: z.nativeEnum(DocumentType, {
    errorMap: () => ({ message: "Tipo de documento inválido" }),
  }),
  companyId: z.string().uuid({ message: "El ID de la empresa debe ser un UUID válido" }),
  creditApplicationId: z
    .string()
    .uuid({ message: "El ID de la solicitud de crédito debe ser un UUID válido" })
    .optional(),
});

export const updateDocumentStatusValidator = z.object({
  status: z.nativeEnum(DocumentStatus, {
    errorMap: () => ({ message: "Estado de documento inválido" }),
  }),
  rejectionReason: z
    .string()
    .min(10, { message: "El motivo de rechazo debe tener al menos 10 caracteres" })
    .refine((val) => val.trim().length >= 10, {
      message: "El motivo de rechazo debe tener al menos 10 caracteres sin contar espacios",
    })
    .optional(),
});