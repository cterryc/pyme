export type CreditAppplication = {
  nameCompany: string
  requestAmonut: string
  subbmitedAt: string
  status: string
}

export type ListCreditApplicationsResponse = {
  success: boolean
  payload: CreditAppplication[]
}


export const BLOCKED_STATUSES = [
  'Enviado', // SUBMITTED
  'En revisión', // UNDER_REVIEW
  'Aprobado', // APPROVED
  'Rechazado', // REJECTED
  'Desembolsado', // DISBURSED
  'Cancelado', // CANCELLED
  'Documentos requeridos'
]