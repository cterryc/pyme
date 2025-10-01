import { UserRole } from "../../constants/Roles";

export interface ITokenPayload {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
}

export interface IRegisterPayload {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
}

export interface ILoginPayload {
    email: string;
    password: string;
}

export interface IAuthResponse {
    token: string;
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