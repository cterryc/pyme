import { z } from "zod";

export const userRegisterPayloadValidator = z.object({
  email: z.string().email({ message: "Dirección de email inválida" }),
  password: z
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
    }),
});

export const userLoginPayloadValidator = z.object({
  email: z.string().email({ message: "Dirección de email inválida" }),
  password: z.string().min(1, { message: "La contraseña es requerida" }),
});

const phoneRegex =
  /^(\+51|51)?[9]\d{8}$|^(\+54|54)?[9]\d{9,10}$|^(\+595|595)?[9]\d{8}$/;

export const userUpdatePayloadValidator = z.object({
  firstName: z
    .string()
    .min(3, { message: "El nombre debe tener al menos 3 caracteres" })
    .max(100, { message: "El nombre no puede exceder 100 caracteres" })
    .optional(),
  lastName: z
    .string()
    .min(3, { message: "El apellido debe tener al menos 3 caracteres" })
    .max(100, { message: "El apellido no puede exceder 100 caracteres" })
    .optional(),
  phone: z
    .string()
    .regex(phoneRegex, {
      message:
        "Formato de teléfono inválido. Debe ser un número válido de Perú (+51), Argentina (+54) o Paraguay (+595)",
    })
    .optional()
    .nullable(),
  profileImage: z
    .string()
    .url({ message: "La URL de la imagen de perfil debe ser válida" })
    .optional()
    .nullable(),
  email: z
    .string()
    .email({ message: "Dirección de email inválida" })
    .optional(),
  newPassword: z
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
    .optional(),
  currentPassword: z.string().optional(),
});

export const forgotPasswordValidator = z.object({
  email: z.string().email({ message: "Dirección de email inválida" }),
});

export const resetPasswordValidator = z.object({
  token: z.string().min(1, { message: "El token es requerido" }),
  newPassword: z
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
    }),
});

export const verifyEmailValidator = z.object({
  email: z.string().email({ message: "Dirección de email inválida" }),
  code: z.string().length(6, { message: "El código debe tener 6 dígitos" }),
});

export const resendVerificationValidator = z.object({
  email: z.string().email({ message: "Dirección de email inválida" }),
});