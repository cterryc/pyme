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
