import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Correo inválido'),
  password: z.string()
})

export const registerSchema = loginSchema
  .extend({
    password: z.string().min(8, 'La contraseña debe tener mínimo 8 caracteres'),
    confirmPassword: z.string().min(8, 'La confirmación de la contraseña debe tener mínimo 8 caracteres')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword']
  })

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>

export const resetPasswordSchema = z
  .object({
    token: z.string().nullable().optional(),
    password: z
      .string()
      .min(8, 'El password debe tener al menos 8 caracteres')
      .refine((password) => /[A-Z]/.test(password), {
        message: 'Debe contener al menos una mayúscula'
      })
      .refine((password) => /[a-z]/.test(password), {
        message: 'Debe contener al menos una minúscula'
      })
      .refine((password) => /\d/.test(password), {
        message: 'Debe contener al menos un número'
      }),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Los passwords no coinciden',
    path: ['confirmPassword'] // Esto hace que el error se asocie al campo confirmPassword
  })

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
