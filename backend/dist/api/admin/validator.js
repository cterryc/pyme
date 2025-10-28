"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCreditApplicationStatusSchema = exports.updateIndustrySchema = exports.createIndustrySchema = exports.idParamSchema = exports.updateRiskTierConfigSchema = exports.createRiskTierConfigSchema = exports.updateSystemConfigSchema = exports.createSystemConfigSchema = void 0;
const zod_1 = require("zod");
const RiskTier_1 = require("../../constants/RiskTier");
const CreditStatus_1 = require("../../constants/CreditStatus");
exports.createSystemConfigSchema = zod_1.z
    .object({
    key: zod_1.z.string().min(1).max(100)
        .refine((val) => val.trim().length > 0, {
        message: "La clave no puede contener solo espacios en blanco",
    }),
    value: zod_1.z.coerce.number()
        .refine((val) => !isNaN(val) && isFinite(val), {
        message: "El valor debe ser un número válido",
    }),
    description: zod_1.z.string().trim().optional().or(zod_1.z.literal('')),
})
    .strict();
exports.updateSystemConfigSchema = exports.createSystemConfigSchema.partial();
exports.createRiskTierConfigSchema = zod_1.z
    .object({
    tier: zod_1.z.nativeEnum(RiskTier_1.RiskTier),
    spread: zod_1.z.coerce.number()
        .min(0, { message: "El spread no puede ser negativo" })
        .refine((val) => !isNaN(val) && isFinite(val), {
        message: "El spread debe ser un número válido",
    }),
    factor: zod_1.z.coerce.number()
        .min(0, { message: "El factor no puede ser negativo" })
        .refine((val) => !isNaN(val) && isFinite(val), {
        message: "El factor debe ser un número válido",
    }),
    allowed_terms: zod_1.z.array(zod_1.z.coerce.number().int().positive()).nonempty(),
})
    .strict();
exports.updateRiskTierConfigSchema = exports.createRiskTierConfigSchema.partial();
exports.idParamSchema = zod_1.z.string().uuid({ message: "ID inválido" });
// Industry validators
exports.createIndustrySchema = zod_1.z
    .object({
    name: zod_1.z
        .string()
        .min(1)
        .max(100)
        .refine((val) => val.trim().length > 0, {
        message: "El nombre no puede contener solo espacios en blanco",
    })
        .transform((v) => v.toLowerCase()),
    baseRiskTier: zod_1.z.nativeEnum(RiskTier_1.RiskTier),
    description: zod_1.z.string().trim().optional().or(zod_1.z.literal('')),
})
    .strict();
exports.updateIndustrySchema = exports.createIndustrySchema.partial();
// Credit Application Management Validators
exports.updateCreditApplicationStatusSchema = zod_1.z
    .object({
    newStatus: zod_1.z.nativeEnum(CreditStatus_1.CreditApplicationStatus),
    rejectionReason: zod_1.z.string()
        .refine((val) => !val || val.trim().length > 0, {
        message: "La razón de rechazo no puede contener solo espacios en blanco",
    })
        .optional(),
    internalNotes: zod_1.z.string()
        .refine((val) => !val || val.trim().length > 0, {
        message: "Las notas internas no pueden contener solo espacios en blanco",
    })
        .optional(),
    approvedAmount: zod_1.z.coerce.number()
        .positive({ message: "El monto aprobado debe ser mayor a 0" })
        .refine((val) => !isNaN(val) && isFinite(val), {
        message: "El monto aprobado debe ser un número válido",
    })
        .optional(),
    riskScore: zod_1.z.coerce.number()
        .min(0, { message: "El score de riesgo no puede ser negativo" })
        .max(100, { message: "El score de riesgo no puede ser mayor a 100" })
        .refine((val) => !isNaN(val) && isFinite(val), {
        message: "El score de riesgo debe ser un número válido",
    })
        .optional(),
})
    .strict()
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
//# sourceMappingURL=validator.js.map