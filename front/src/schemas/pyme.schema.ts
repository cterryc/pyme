import { normalizeSpaces } from '@/helpers/normalizeSpaces'
import { z } from 'zod'
// const phoneRegex = /^(\+51|51)?[9]\d{8}$|^(\+54|54)?[9]\d{9,10}$|^(\+595|595|)?[9]\d{8}$/
// const phoneRegex = /^(\+51|51)?[9]\d{8}$|^(\+54|54)?[9]\d{9,10}$|^(\+595|595)?[9]\d{8}$|^(\+598|598)?[9]\d{7}$/

const textField = (minChars: number, requiredMessage?: string, minMessage?: string) => {
  return z
    .string()
    .min(1, requiredMessage || 'Este campo es requerido')
    .transform((val) => normalizeSpaces(val))
    .refine(
      (val) => val.replace(/\s/g, '').length >= minChars,
      minMessage || `Debe tener al menos ${minChars} caracteres`
    )
}

const validateUrl = (url: string) => {
  try {
    const urlToCheck = url.includes('://') ? url : `https://${url}`
    const parsedUrl = new URL(urlToCheck)

    const hostname = parsedUrl.hostname
    const isValidDomain = hostname.includes('.') // || hostname === 'localhost' || hostname === '127.0.0.1'

    return isValidDomain && hostname.length > 3
  } catch {
    return false
  }
}

const getPhoneRegexForCountry = (countryCode: number) => {
  const patterns = {
    // 0: /^(\+598|598)?[9]\d{8}$/, // Uruguay
    // 1: /^(\+54|54)?[9]\d{9,10}$/, // Argentina
    // 2: /^(\+595|595)?[9]\d{8}$/, // Paraguay
    // 3: /^(\+51|51)?[9]\d{8}$/ // Perú
    0: /^[9]\d{7}$/, // Uruguay
    1: /^(\+54|54)?[9]\d{9,10}$/, // Argentina
    2: /^(\+595|595)?[9]\d{8}$/, // Paraguay
    3: /^(\+51|51)?[9]\d{8}$/ // Perú
  }

  return patterns[countryCode as keyof typeof patterns] || patterns[0]
}

const getCountryFormatMessage = (countryCode: number) => {
  const countryNames = {
    0: 'Para Uruguay es 9X XXX XXX',
    1: 'Para Argentina es 9 XXX XXX XXX',
    2: 'Para Perú es 9 XX XX XX XX',
    3: 'Para Paraguay es 9 XX XXX XXX'
  }

  return countryNames[countryCode as keyof typeof countryNames] || 'Uruguay'
}

export const registerPymeSchema = z
  .object({
    countryCode: z.coerce.number(),
    legalName: textField(3, 'El nombre legal es requerido', 'El nombre legal debe tener al menos tres caracteres'),
    tradeName: textField(
      3,
      'El nombre comercial es requerido',
      'El nombre comercial debe tener al menos tres caracteres'
    ),
    taxId: textField(11, 'CUIT es requerido', 'CUIT debe tener al menos 11 caracteres'),
    email: z.string().email('Debes ingresar un email válido'),
    industryId: z.string().min(3, 'Debes ingresar una industria'),
    foundedDate: z.date('Fecha incompleta'),
    employeeCount: z.coerce
      .number('Debes ingresar un numero')
      .min(1, 'Debes ingresar la cantidad de empleados')
      .refine((val) => val <= 250, 'Maximo 250 empleados'),
    annualRevenue: z.coerce
      .number('Debes ingresar los ingresos anuales')
      .min(1000, 'Debes ingresar una cantidad superior a $1000')
      .refine((val) => val <= 50000000, 'Debes ingresar una cantidad menor a $50.000.000'),
    address: textField(3, 'La dirección es requerida', 'Debes ingresar una dirección con al menos 3 caracteres'),
    city: textField(3, 'La ciudad es requerida', 'Debes ingresar una ciudad con al menos 3 caracteres'),
    state: textField(3, 'La provincia es requerida', 'Debes ingresar una provincia con al menos 3 caracteres'),
    postalCode: textField(
      3,
      'El código postal es requerido',
      'Debes ingresar un código postal con al menos 3 caracteres'
    ),
    country: textField(3, 'El país es requerido', 'Debes ingresar un país con al menos 3 caracteres'),
    phone: z
      .string()
      .min(1, 'El telefono es obligatorio')
      .transform((val) => val.replaceAll(' ', '')),
    // phone: z.string().regex(phoneRegex, {
    //   message:
    //     'Formato de teléfono inválido. Debe ser un número válido de Perú (+51), Argentina (+54) , Paraguay (+595) o Uruguay (+598)'
    // }),
    website: z
      .union([
        z.literal(''),
        z.string().refine(validateUrl, {
          message: 'Debe ingresar una URL válida (ej: https://mipagina.com, http://mipagina.com o mipagina.com)'
        })
      ])
      .optional(),
    description: z
      .string()
      .min(1, 'La descripción es requerida')
      .transform((val) => normalizeSpaces(val))
      .refine((val) => val.replace(/\s/g, '').length >= 60, 'Debes ingresar una descripción de al menos 60 caracteres')
  })
  .superRefine((data, ctx) => {
    const regex = getPhoneRegexForCountry(data.countryCode)
    if (!regex.test(data.phone)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Formato de teléfono inválido. ${getCountryFormatMessage(data.countryCode)}`,
        path: ['phone']
      })
    }
  })

export const registerPymeDocumentsSchema = z.object({
  isOwner: z.boolean(),
  // documents: z.array(
  //   z.object(
  //     {
  //       docName: z.string(),
  //       data: z.instanceof(ArrayBuffer),
  //       sign: z.instanceof(ArrayBuffer)
  //     },
  //     'fiumba'
  //   )
  // )
  notarialPDF: z.file(),
  documents: z.any().refine((val) => val instanceof FileList, 'Debe ser una lista de archivos')
})

export type RegisterPymeFormData = z.infer<typeof registerPymeSchema>
export type RegisterPymeDocumentsFormData = z.infer<typeof registerPymeDocumentsSchema>

export const loanRequestSchema = z.object({
  companyId: z.uuid()
})
export const loanRequestConfirmSchema = z.object({
  id: z.uuid(),
  companyId: z.uuid(),
  selectedAmount: z.number().min(0),
  selectedTermMonths: z.int().min(0)
})

export type LoanRequestConfirmFormData = z.infer<typeof loanRequestConfirmSchema>
export type LoanRequestFormData = z.infer<typeof loanRequestSchema>
