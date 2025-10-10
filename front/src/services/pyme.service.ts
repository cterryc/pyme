import { type RegisterPymeSucessResponse } from '@/interfaces/pyme.interface'
import { type RegisterPymeFormData } from '@/schemas/pyme.schema'

export const pymeRegister = async (data: RegisterPymeFormData): Promise<RegisterPymeSucessResponse> => {
  try {
    const token = localStorage.tokenPyme

    const response = await fetch(`${import.meta.env.VITE_API_URL}/companies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data)
    })

    const result = await response.json()
    if (!response.ok) throw result

    return result
  } catch (error) {
    console.error('[authRegister]: Error fetching data:', error)
    throw error
  }
}

export const pymeRegisterDocuments = async (
  // data: RegisterPymeDocumentsFormData
  data: FormData
): Promise<RegisterPymeSucessResponse> => {
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
    console.error('[authRegister]: Error fetching data:', error)
    throw error
  }
}
