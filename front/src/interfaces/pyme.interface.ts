export type RegisterPymeSucessResponse = {
  success: boolean
  payload: {
    id: string
    legalName: string
    tradeName: string
    phone: number
    email: string
    taxId: string
    ownerId: string
    industry: string
    foundedDate: string
    employeeCount: number
    annualRevenue: number
    address: string
    city: string
    state: string
    postalCode: string
    country: string
    website: null
    description: string
  }
}
// export type RegisterPymeErrorResponse = { success: boolean; payload: Array<{ path: string; message: string }> }
export type RegisterPymeErrorResponse = { success: boolean; payload: { message: string } }

export type RegisterPymeDocumentsSuccessResponse = {
  success: boolean
  payload: { documents: Array<DocumentResponse> }
}

export type DocumentResponse = {
  id: string
  type: string
  fileName: string
  fileUrl: string
  mimeType: string
  fileSize: number
  status: string
  companyId: string
  creditApplicationId?: string
  uploadedById: string
  createdAt: string
  updatedAt: string
}

export type GetPymeResponse = {
  id: string
  legalName: string
  industry: string
  ownerName: string
  ownerSurname: string
  statusCredit: string
  hasDocuments: boolean
}

export type GetPymesByUserResponse = {
  success: boolean
  payload: GetPymeResponse[]
}

export type LoanRequestResponse = {
  tradeName: string
  minAmount: string
  maxAmount: string
  paymentOptions: Array<PaymentOption>
}
type PaymentOption = {
  paymentsNumber: string
  interestRate: string
}
export type LoanRequestErrorResponse = { success: boolean; payload: { message: string } }
