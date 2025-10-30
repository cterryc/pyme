export type LoanRequestPayload = {
  id: string
  applicationNumber: string
  legalName: string
  annualRevenue: string
  offerDetails: {
    allowedTerms: number[]
    interestRate: number
    maxAmount: number
    minAmount: number
  }
  selectedDetails: {
    amount: string
    termMonths: number
  }
  requestId?: string
}

export type LoanCreditRequestResponse = {
  success: boolean
  payload: LoanRequestPayload
}

export type CreditAppplication = {
  id: string
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
  'Documentos requeridos',
  'No aplica'
]
