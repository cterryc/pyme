"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDocumentStatusValidator = exports.uploadDocumentValidator = void 0;
const zod_1 = require("zod");
const CreditStatus_1 = require("../../constants/CreditStatus");
exports.uploadDocumentValidator = zod_1.z.object({
    type: zod_1.z.nativeEnum(CreditStatus_1.DocumentType, {
        errorMap: () => ({ message: "Tipo de documento inválido" }),
    }),
    companyId: zod_1.z.string().uuid({ message: "El ID de la empresa debe ser un UUID válido" }),
    creditApplicationId: zod_1.z
        .string()
        .uuid({ message: "El ID de la solicitud de crédito debe ser un UUID válido" })
        .optional(),
});
exports.updateDocumentStatusValidator = zod_1.z.object({
    status: zod_1.z.nativeEnum(CreditStatus_1.DocumentStatus, {
        errorMap: () => ({ message: "Estado de documento inválido" }),
    }),
    rejectionReason: zod_1.z
        .string()
        .min(10, { message: "El motivo de rechazo debe tener al menos 10 caracteres" })
        .refine((val) => val.trim().length >= 10, {
        message: "El motivo de rechazo debe tener al menos 10 caracteres sin contar espacios",
    })
        .optional(),
});
//# sourceMappingURL=validator.js.map