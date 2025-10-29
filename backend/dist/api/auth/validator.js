"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendVerificationValidator = exports.verifyEmailValidator = exports.resetPasswordValidator = exports.forgotPasswordValidator = exports.userUpdatePayloadValidator = exports.userLoginPayloadValidator = exports.userRegisterPayloadValidator = void 0;
const zod_1 = require("zod");
exports.userRegisterPayloadValidator = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Dirección de email inválida" }),
    password: zod_1.z
        .string()
        .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
        .regex(/[A-Z]/, {
        message: "La contraseña debe contener al menos una letra mayúscula",
    })
        .regex(/[a-z]/, {
        message: "La contraseña debe contener al menos una letra minúscula",
    })
        .regex(/[0-9]/, {
        message: "La contraseña debe contener al menos un número",
    })
        .refine((val) => val.trim().length >= 8, {
        message: "La contraseña no puede contener solo espacios en blanco",
    }),
});
exports.userLoginPayloadValidator = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Dirección de email inválida" }),
    password: zod_1.z.string().min(1, { message: "La contraseña es requerida" })
        .refine((val) => val.trim().length > 0, {
        message: "La contraseña no puede ser solo espacios en blanco",
    }),
});
const phoneRegex = /^(\+51|51)?[9]\d{8}$|^(\+54|54)?[9]\d{9,10}$|^(\+595|595)?[9]\d{8}$/;
exports.userUpdatePayloadValidator = zod_1.z.object({
    firstName: zod_1.z
        .string()
        .min(3, { message: "El nombre debe tener al menos 3 caracteres" })
        .max(100, { message: "El nombre no puede exceder 100 caracteres" })
        .refine((val) => val.trim().length >= 3, {
        message: "El nombre debe tener al menos 3 caracteres sin contar espacios",
    })
        .optional(),
    lastName: zod_1.z
        .string()
        .min(3, { message: "El apellido debe tener al menos 3 caracteres" })
        .max(100, { message: "El apellido no puede exceder 100 caracteres" })
        .refine((val) => val.trim().length >= 3, {
        message: "El apellido debe tener al menos 3 caracteres sin contar espacios",
    })
        .optional(),
    phone: zod_1.z
        .string()
        .regex(phoneRegex, {
        message: "Formato de teléfono inválido. Debe ser un número válido de Perú (+51), Argentina (+54) o Paraguay (+595)",
    })
        .optional()
        .nullable(),
    profileImage: zod_1.z
        .string()
        .url({ message: "La URL de la imagen de perfil debe ser válida" })
        .optional()
        .nullable(),
    email: zod_1.z
        .string()
        .email({ message: "Dirección de email inválida" })
        .optional(),
    newPassword: zod_1.z
        .string()
        .min(8, { message: "La nueva contraseña debe tener al menos 8 caracteres" })
        .regex(/[A-Z]/, {
        message: "La nueva contraseña debe contener al menos una letra mayúscula",
    })
        .regex(/[a-z]/, {
        message: "La nueva contraseña debe contener al menos una letra minúscula",
    })
        .regex(/[0-9]/, {
        message: "La nueva contraseña debe contener al menos un número",
    })
        .refine((val) => val.trim().length >= 8, {
        message: "La nueva contraseña no puede contener solo espacios en blanco",
    })
        .optional(),
    currentPassword: zod_1.z.string().optional(),
});
exports.forgotPasswordValidator = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Dirección de email inválida" }),
});
exports.resetPasswordValidator = zod_1.z.object({
    token: zod_1.z.string().min(1, { message: "El token es requerido" })
        .refine((val) => val.trim().length > 0, {
        message: "El token no puede ser solo espacios en blanco",
    }),
    newPassword: zod_1.z
        .string()
        .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
        .regex(/[A-Z]/, {
        message: "La contraseña debe contener al menos una letra mayúscula",
    })
        .regex(/[a-z]/, {
        message: "La contraseña debe contener al menos una letra minúscula",
    })
        .regex(/[0-9]/, {
        message: "La contraseña debe contener al menos un número",
    })
        .refine((val) => val.trim().length >= 8, {
        message: "La contraseña no puede contener solo espacios en blanco",
    }),
});
exports.verifyEmailValidator = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Dirección de email inválida" }),
    code: zod_1.z.string().length(6, { message: "El código debe tener 6 dígitos" })
        .refine((val) => val.trim().length === 6, {
        message: "El código no puede contener espacios en blanco",
    }),
});
exports.resendVerificationValidator = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Dirección de email inválida" }),
});
