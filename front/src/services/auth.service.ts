import type { AuthSucessResponse } from '@/interfaces/auth.interface'
import { type LoginFormData, type RegisterFormData } from '@/schemas/auth.schema'

export const authRegister = async (data: RegisterFormData): Promise<AuthSucessResponse> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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

export const authLogin = async (data: LoginFormData): Promise<AuthSucessResponse> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    const result = await response.json()
    if (!response.ok) throw result
    return result
  } catch (error) {
    console.error('[authLogin]: Error fetching data:', error)
    throw error
  }
}

export const resetPassword = async (data: { email: string }) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    const result = await response.json()
    if (!response.ok) throw result

    return result
  } catch (error) {
    console.error('[resetPassword]: Error fetching data:', error)
    throw error
  }
}
