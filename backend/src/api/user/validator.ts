import { z } from "zod";

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
