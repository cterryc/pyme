import { z } from 'zod'
const phoneRegex = /^(\+51|51)?[9]\d{8}$|^(\+54|54)?[9]\d{9,10}$|^(\+595|595)?[9]\d{8}$/

export const registerPymeSchema = z.object({
  // isOwner: z.boolean(),
  // pymeData: z.object({
  legalName: z.string().min(3, 'El nombre legal debe tener al menos tres caracteres'),
  tradeName: z.string().min(3, 'El nombre comercial debe tener al menos tres caracteres'),
  taxId: z.string().min(11, 'CUIT debe tener 11 al menos caracteres'), //Hay que definir bien el formato
  email: z.email('Debes ingresar un email válido'),
  // ownerName: z.string().min(3, 'El nombre del dueño debe tener al menos tres caracteres'), //Van?
  // ownerSurname: z.string().min(3, 'El apllido del dueño debe tener al menos tres caracteres'), //Van?
  industryId: z.string().min(3, 'Debes ingresar una industria'), // eventualmente un enum?
  foundedDate: z.date('Fecha incompleta'),
  employeeCount: z.number().min(0, 'Debes ingresar la cantidad de empleados'),
  annualRevenue: z.number().min(0, 'Debes ingresar los ingresos anuales'),
  // companyAddress: z.object({
  address: z.string().min(3, 'Debes ingresar una dirección con al menos 3 caracteres'),
  city: z.string().min(3, 'Debes ingresar una ciudad con al menos 3 caracteres'),
  state: z.string().min(3, 'Debes ingresar una provincia con al menos 3 caracteres'),
  postalCode: z.string().min(3, 'Debes ingresar una código postal con al menos 3 caracteres'),
  country: z.string().min(3, 'Debes ingresar una país con al menos 3 caracteres'),
  // }),
  // contact: z.object({
  phone: z.string().regex(phoneRegex, {
    message: 'Formato de teléfono inválido. Debe ser un número válido de Perú (+51), Argentina (+54) o Paraguay (+595)'
  }),
  // ownerPhone: z.string().min(8, 'Debes ingresar una telefono válido'), //Como definimos esto?
  website: z.url().optional(),
  // }),
  description: z.string().min(120, 'Debes ingresar una descripción de al menos 120 caracteres')
  // documents: z.array(
  //   z.object({
  //     data: z.instanceof(ArrayBuffer),
  //     sign: z.instanceof(ArrayBuffer)
  //   })
  // )
  // })
})

export const registerPymeDocumentsSchema = z.object({
  isOwner: z.boolean(),
  documents: z.array(
    z.object({
      docName: z.string(),
      data: z.instanceof(ArrayBuffer),
      sign: z.instanceof(ArrayBuffer)
    })
  )
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
