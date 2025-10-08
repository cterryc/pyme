import { z } from 'zod'

export const registerPymeSchema = z.object({
  isOwner: z.boolean(),
  pymeData: z.object({
    legalName: z.string().min(3, 'El nombre legal debe tener al menos tres caracteres'),
    tradeName: z.string().min(3, 'El nombre comercial debe tener al menos tres caracteres'),
    taxId: z.string().min(11, 'CUIT debe tener 11 al menos caracteres'), //Hay que definir bien el formato
    email: z.email('Debes ingresar un email válido'),
    ownerName: z.string().min(3, 'El nombre del dueño debe tener al menos tres caracteres'), //Van?
    ownerSurname: z.string().min(3, 'El apllido del dueño debe tener al menos tres caracteres'), //Van?
    companySector: z.string().min(3, 'Debes ingresar una industria'), // eventualmente un enum?
    foundationDate: z.date('Fecha incompleta'),
    employeesNumber: z.number().min(0, 'Debes ingresar la cantidad de empleados'),
    annualIncome: z.number().min(0, 'Debes ingresar los ingresos anuales'),
    companyAddress: z.object({
      address: z.string().min(3, 'Debes ingresar una dirección con al menos 3 caracteres'),
      city: z.string().min(3, 'Debes ingresar una ciudad con al menos 3 caracteres'),
      province: z.string().min(3, 'Debes ingresar una provincia con al menos 3 caracteres'),
      zipCode: z.string().min(3, 'Debes ingresar una código postal con al menos 3 caracteres'),
      country: z.string().min(3, 'Debes ingresar una país con al menos 3 caracteres')
    }),
    contact: z.object({
      phone: z.string().min(8, 'Debes ingresar una telefono válido'), //Como definimos esto?
      ownerPhone: z.string().min(8, 'Debes ingresar una telefono válido'), //Como definimos esto?
      website: z.url().optional()
    }),
    description: z.string().min(120, 'Debes ingresar una descripción de al menos 150 caracteres'),
    documents: z.array(
      z.object({
        data: z.instanceof(ArrayBuffer),
        sign: z.instanceof(ArrayBuffer)
      })
    )
  })
})

export type RegisterPymeFormData = z.infer<typeof registerPymeSchema>

// export const registerPymeSchema = z.object({
//   nombreLegal: z.string().min(3, 'El nombre legal debe tener al menos tres caracteres'),
//   nombreComercial: z.string().min(3, 'El nombre comercial debe tener al menos tres caracteres'),
//   nombreDuenio: z.string().min(3, 'El nombre del dueño debe tener al menos tres caracteres'), //Van?
//   apellidoDuenio: z.string().min(3, 'El apllido del dueño debe tener al menos tres caracteres'), //Van?
//   taxId: z.string().min(11, 'CUIT debe tener 11 al menos caracteres'), //Hay que definir bien el formato
//   email: z.email('Debes ingresar un email válido'),
//   industria: z.string().min(3, 'Debes ingresar una industria'), // eventualmente un enum?
//   fechaCreacion: z.date('Fecha incompleta'),
//   cantidadEmpleados: z.number().min(0, 'Debes ingresar la cantidad de empleados'),
//   ingresosAnual: z.number().min(0, 'Debes ingresar los ingresos anuales'),
//   direccion: z.string().min(3, 'Debes ingresar una dirección con al menos 3 caracteres'),
//   ciudad: z.string().min(3, 'Debes ingresar una ciudad con al menos 3 caracteres'),
//   provincia: z.string().min(3, 'Debes ingresar una provincia con al menos 3 caracteres'),
//   codigoPostal: z.string().min(3, 'Debes ingresar una código postal con al menos 3 caracteres'),
//   pais: z.string().min(3, 'Debes ingresar una país con al menos 3 caracteres'),
//   telefono: z.string().min(8, 'Debes ingresar una telefono válido'), //Como definimos esto?
//   website: z.url().optional(),
//   descripcion: z.string().min(120, 'Debes ingresar una descripción de al menos 150 caracteres')
// })
