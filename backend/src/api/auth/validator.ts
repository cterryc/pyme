import { z } from "zod";

export const userRegisterPayloadValidator = z.object({
    email: z.string().email({ message: "Dirección de email inválida" }),
    password: z
        .string()
        .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
        .regex(/[A-Z]/, { message: "La contraseña debe contener al menos una letra mayúscula" })
        .regex(/[a-z]/, { message: "La contraseña debe contener al menos una letra minúscula" })
        .regex(/[0-9]/, { message: "La contraseña debe contener al menos un número" }),
    firstName: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
    lastName: z.string().min(2, { message: "El apellido debe tener al menos 2 caracteres" }),
    phone: z.string().optional(),
});

export const userLoginPayloadValidator = z.object({
    email: z.string().email({ message: "Dirección de email inválida" }),
    password: z.string().min(1, { message: "La contraseña es requerida" }),
});
