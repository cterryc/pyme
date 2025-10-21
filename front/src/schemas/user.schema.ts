import { z } from 'zod'
const phoneRegex = /^(\+51|51)?[9]\d{8}$|^(\+54|54)?[9]\d{9,10}$|^(\+595|595)?[9]\d{8}$/

export const userProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z
    .string()
    .regex(phoneRegex, {
      message:
        'Formato de teléfono inválido. Debe ser un número válido de Perú (+51), Argentina (+54) o Paraguay (+595)'
    })
    .optional()
    .nullable(),
  profileImage: z.string().optional(),
  email: z.email('Correo inválido').optional()
  // newPassword: z.string().min(8, "La nueva contraseña debe tener mínimo 8 caracteres").optional(),
  // currentPassword: z.string().min(8, "La contraseña actual debe tener mínimo 8 caracteres"),
})

export type UserProfileFormData = z.infer<typeof userProfileSchema>
