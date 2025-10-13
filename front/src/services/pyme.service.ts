<<<<<<< Updated upstream
import {
  type RegisterPymeSucessResponse,
  type RegisterPymeDocumentsSuccessResponse,
  type GetPymesByUserResponse,
  type LoanRequestResponse
} from '@/interfaces/pyme.interface'
import { type LoanRequestFormData, type RegisterPymeFormData } from '@/schemas/pyme.schema'

export const pymeRegister = async (data: RegisterPymeFormData): Promise<RegisterPymeSucessResponse> => {
  try {
    const token = localStorage.tokenPyme

    const response = await fetch(`${import.meta.env.VITE_API_URL}/companies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
=======
import { type PymeData } from '@/interfaces/pyme.interface'

export const registerPyme = async (data: PymeData) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
>>>>>>> Stashed changes
      body: JSON.stringify(data)
    })

    const result = await response.json()
<<<<<<< Updated upstream
    if (!response.ok) throw result

    return result
  } catch (error) {
    console.error('[pymeRegister]: Error fetching data:', error)
    throw error
  }
}

export const pymeRegisterDocuments = async (data: FormData): Promise<RegisterPymeDocumentsSuccessResponse> => {
  try {
    const token = localStorage.tokenPyme

    const response = await fetch(`${import.meta.env.VITE_API_URL}/documents/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: data
    })

    const result = await response.json()
    if (!response.ok) throw result

    return result
  } catch (error) {
    console.error('[pymeRegisterDocuments]: Error fetching data:', error)
    throw error
  }
}

export const pymeLoanRequestOptions = async (data: LoanRequestFormData): Promise<LoanRequestResponse> => {
  try {
    const token = localStorage.tokenPyme

    const response = await fetch(`${import.meta.env.VITE_API_URL}/credit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data)
    })

    const result = await response.json()
    if (!response.ok) throw result

    return result
  } catch (error) {
    console.error('[pymeRegister]: Error fetching data:', error)
    throw error
  }
}

export const getPymesByUser = async (): Promise<GetPymesByUserResponse> => {
  try {
    const token = localStorage.tokenPyme

    const response = await fetch(`${import.meta.env.VITE_API_URL}/companies`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    })

    const result = await response.json()
    if (!response.ok) throw result

    return result;
  } catch (error) {
    console.error("[getPymesByUser]: Error fetching data:", error);
    throw error;
  }
}
