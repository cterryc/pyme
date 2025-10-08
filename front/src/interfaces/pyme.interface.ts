export type PymeData = {
  // id: string
  nombreLegal: string
  nombreComercial: string
  nombreDuenio: string //Van?
  apellidoDuenio: string //Van?
  taxId: string //CUIT
  email: string
  industria: string // eventualmente un enum?
  fechaCreacion: Date
  cantidadEmpleados: number
  gananciaAnual: number
  direccion: string
  ciudad: string
  provincia: string
  codigoPostal: string
  pais: string
  telefono: string
  website: URL
  descripcion: string
  //documentos,excels , pdf, etc?
}
