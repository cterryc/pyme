export type CreditAppplication = {
  nameCompany: string
  requestedAmount: number
  submittedAt: string
  status: string
}

export type ListCreditApplications = {
  success: boolean
  payload: CreditAppplication[]
}