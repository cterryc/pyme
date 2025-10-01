import  { UserRole }  from "../../constants/Roles";

export interface IUser {
  id : string;
  userName: string;
  email: string;
  password: string;
  address: { street: string; city: string; province: string; country: string } | null;
  phone: string | null;
  providerId : string | null;
  googleId: string | null;
  role: UserRole;
  resetToken: string | null;
  resetTokenExpires: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  updatedBy: string | null;
}

export interface UserLoginFields {
  email: string;
  password: string;
}