"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCreditApplicationsForAdminQuerySchema = exports.updateCreditApplicationStatusBodySchemaWithValidation = exports.updateCreditApplicationStatusBodySchema = exports.updateCreditApplicationStatusParamsSchema = exports.deleteCreditApplicationParamsSchema = exports.getCreditApplicationByIdParamsSchema = exports.listCreditApplicationsQuerySchema = exports.getCreditApplicationStatusParamsSchema = exports.createCreditApplicationSchema = exports.loanRequestSchema = void 0;
const zod_1 = require("zod");
const CreditStatus_1 = require("../../constants/CreditStatus");
exports.loanRequestSchema = zod_1.z
    .object({
    companyId: zod_1.z.string().uuid({ message: "ID de compañía inválido" }),
})
    .strict();
exports.createCreditApplicationSchema = zod_1.z
    .object({
    id: zod_1.z.string().uuid({ message: "ID de solicitud inválido" }),
    companyId: zod_1.z.string().uuid({ message: "ID de compañía inválido" }),
    selectedAmount: zod_1.z
        .number()
        .positive({ message: "Monto seleccionado debe ser mayor a 0" })
        .refine((val) => !isNaN(val) && isFinite(val), {
        message: "El monto seleccionado debe ser un número válido",
    }),
    selectedTermMonths: zod_1.z
        .number()
        .int({ message: "El plazo debe ser un número entero" })
        .min(1, { message: "El plazo seleccionado debe ser al menos 1 mes" })
        .max(360, { message: "El plazo no puede exceder 360 meses (30 años)" })
        .refine((val) => !isNaN(val) && isFinite(val), {
        message: "El plazo debe ser un número válido",
    }),
})
    .strict();
exports.getCreditApplicationStatusParamsSchema = zod_1.z
    .object({
    id: zod_1.z.string().uuid({ message: "ID de solicitud inválido" }),
})
    .strict();
exports.listCreditApplicationsQuerySchema = zod_1.z
    .object({
    page: zod_1.z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 1))
        .refine((val) => val >= 1, { message: "Página debe ser mayor a 0" }),
    limit: zod_1.z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 10))
        .refine((val) => val >= 1 && val <= 100, {
        message: "Límite debe estar entre 1 y 100"
    }),
    status: zod_1.z
        .nativeEnum(CreditStatus_1.CreditApplicationStatus)
        .optional(),
})
    .strict();
exports.getCreditApplicationByIdParamsSchema = zod_1.z
    .object({
    id: zod_1.z.string().uuid({ message: "ID de solicitud inválido" }),
})
    .strict();
exports.deleteCreditApplicationParamsSchema = zod_1.z
    .object({
    id: zod_1.z.string().uuid({ message: "ID de solicitud inválido" }),
})
    .strict();
exports.updateCreditApplicationStatusParamsSchema = zod_1.z
    .object({
    id: zod_1.z.string().uuid({ message: "ID de solicitud inválido" }),
})
    .strict();
exports.updateCreditApplicationStatusBodySchema = zod_1.z
    .object({
    newStatus: zod_1.z.nativeEnum(CreditStatus_1.CreditApplicationStatus, {
        message: "Estado de solicitud inválido",
    }),
    rejectionReason: zod_1.z
        .string()
        .min(1, { message: "Razón de rechazo no puede estar vacía" })
        .max(1000, { message: "Razón de rechazo muy larga" })
        .refine((val) => val.trim().length > 0, {
        message: "La razón de rechazo no puede contener solo espacios en blanco",
    })
        .optional(),
    internalNotes: zod_1.z
        .string()
        .max(2000, { message: "Notas internas muy largas" })
        .refine((val) => !val || val.trim().length > 0, {
        message: "Las notas internas no pueden contener solo espacios en blanco",
    })
        .optional(),
    userNotes: zod_1.z
        .string({ required_error: "Las notas para el usuario son obligatorias" })
        .min(1, { message: "Las notas para el usuario son obligatorias" })
        .max(2000, { message: "Notas para el usuario muy largas" })
        .refine((val) => val.trim().length > 0, {
        message: "Las notas para el usuario no pueden contener solo espacios en blanco",
    }),
    approvedAmount: zod_1.z
        .number()
        .positive({ message: "Monto aprobado debe ser mayor a 0" })
        .refine((val) => !isNaN(val) && isFinite(val), {
        message: "El monto aprobado debe ser un número válido",
    })
        .optional(),
    riskScore: zod_1.z
        .number()
        .min(0, { message: "Score de riesgo no puede ser negativo" })
        .max(100, { message: "Score de riesgo no puede ser mayor a 100" })
        .refine((val) => !isNaN(val) && isFinite(val), {
        message: "El score de riesgo debe ser un número válido",
    })
        .optional(),
})
    .strict();
exports.updateCreditApplicationStatusBodySchemaWithValidation = exports.updateCreditApplicationStatusBodySchema
    .refine((data) => {
    // Si el estado es REJECTED, se requiere rejectionReason
    if (data.newStatus === CreditStatus_1.CreditApplicationStatus.REJECTED) {
        return data.rejectionReason && data.rejectionReason.trim().length > 0;
    }
    return true;
}, {
    message: "Se requiere una razón de rechazo cuando el estado es REJECTED",
    path: ["rejectionReason"],
});
exports.getCreditApplicationsForAdminQuerySchema = zod_1.z
    .object({
    page: zod_1.z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 1))
        .refine((val) => val >= 1, { message: "Página debe ser mayor a 0" }),
    limit: zod_1.z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 10))
        .refine((val) => val >= 1 && val <= 100, {
        message: "Límite debe estar entre 1 y 100"
    }),
    status: zod_1.z
        .nativeEnum(CreditStatus_1.CreditApplicationStatus)
        .optional(),
    companyName: zod_1.z
        .string()
        .min(1, { message: "Nombre de compañía no puede estar vacío" })
        .max(255, { message: "Nombre de compañía muy largo" })
        .refine((val) => val.trim().length > 0, {
        message: "El nombre de compañía no puede contener solo espacios en blanco",
    })
        .optional(),
})
    .strict();
