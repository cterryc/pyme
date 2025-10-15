import { UserRole } from "../../constants/Roles";

export interface IUser {
  id: string;
  userName: string;
  email: string;
  password: string;
  address: {
    street: string;
    city: string;
    province: string;
    country: string;
  } | null;
  phone: string | null;
  providerId: string | null;
  googleId: string | null;
  role: UserRole;
  resetToken: string | null;
  resetTokenExpires: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  updatedBy: string | null;
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

export interface IUpdateUserPayload {
  firstName?: string;
  lastName?: string;
  phone?: string | null;
  profileImage?: string | null;
  email?: string;
  newPassword?: string;
  currentPassword?: string;
}

export interface IGetUsersQuery {
  page?: number;
  limit?: number;
  role?: UserRole;
  search?: string;
  isActive?: boolean;
}

export interface IGetUsersResponse {
  users: UserDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}