import { UserRole } from "../../constants/Roles";

export interface ITokenPayload {
  id: string;
  email: string;
  role: UserRole;
}

export interface IRegisterPayload {
  email: string;
  password: string;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IAuthResponse {
  token: string;
}

export interface IUpdateUserPayload {
  firstName?: string;
  lastName?: string;
  phone?: string | null;
  profileImage?: string | null;
  email?: string;
  newPassword?: string;
  currentPassword?: string;
}

export interface UserDTO {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  role: UserRole;
  isEmailVerified: boolean;
  profileImage: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// export interface UserDTO {
//   id: string;
//   email: string;
//   firstName: string;
//   lastName: string;
//   phone?: string | null;
//   role: UserRole
//   isEmailVerified: boolean;
//   createdAt: Date;
//   updatedAt: Date;
// }

export interface IForgotPasswordPayload {
  email: string;
}

export interface IResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface IResetPasswordTokenPayload {
  userId: string;
  email: string;
  exp?: number;
}