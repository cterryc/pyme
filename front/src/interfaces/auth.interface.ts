export type AuthSucessResponse = {
  success: boolean
  payload: { token: string } 
}
type ErrorItem = {
  path: string
  message: string
}
export type AuthErrorResponse = {
  success: boolean
  payload: ErrorItem | ErrorItem[];
}
