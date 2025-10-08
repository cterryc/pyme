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
export type RegisterPymeErrorResponse = { success: boolean; payload: { error: string; message: string } }
