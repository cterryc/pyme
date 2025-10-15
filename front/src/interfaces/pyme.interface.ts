export type GetIndustriesResponse = {
  success: boolean
  payload: Array<{ id: string; name: string }>
}

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

//LoanRequestOptionsConfirmResponse es lo mismo que este
export type LoanRequestResponse = {
  success: boolean
  payload: LoanRequestOptions
}
export type LoanRequestOptions = {
  id: string
  applicationNumber: string
  legalName: string
  annualRevenue: number
  offerDetails: OfferDetails
  selectedDetalis?: SelectedDetails
}

export type OfferDetails = {
  minAmount: number
  maxAmount: number
  interestRate: number
  allowedTerms: Array<number>
}
export type SelectedDetails = {
  amount: number
  termMonths: number
}

export type LoanRequestErrorResponse = { success: boolean; payload: { message: string } }
