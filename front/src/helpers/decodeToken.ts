import { jwtDecode } from 'jwt-decode'

export type TokenPayload = {
  id: string
  email: string
  role: string
  iat?: number
  exp?: number
}

export function decodeToken(getToken: string): TokenPayload | string {
  if (!getToken) return 'invalid token'

  try {
    const decoded = jwtDecode<TokenPayload>(getToken)
    const now = Math.floor(Date.now() / 1000)

    if (decoded.exp && decoded.exp < now) {
      localStorage.removeItem('tokenPyme')
      return 'expired token'
    }

    return decoded
  } catch {
    return 'invalid token'
  }
}
