import jwt from "jsonwebtoken";
import config from "../config/enviroment.config";
import { ITokenPayload } from "../api/auth/interfaces";

/**
 * Generate JWT token
 */
export const generateToken = (payload: ITokenPayload): string => {
    return jwt.sign(payload, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    });
};

/**
 * Verify JWT token
 */
export const verifyToken = (token: string): ITokenPayload => {
    try {
        return jwt.verify(token, config.JWT_SECRET) as ITokenPayload;
    } catch (error) {
        throw new Error("Token inválido o expirado");
    }
};

/**
 * Decode JWT token without verification
 */
export const decodeToken = (token: string): ITokenPayload | null => {
    try {
        return jwt.decode(token) as ITokenPayload;
    } catch (error) {
        return null;
    }
};

// utils/jwt.utils.ts (agrega al final del archivo)

export const generateResetPasswordToken = (payload: { userId: string; email: string }): string => {
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: '1h',
  });
};

export const verifyResetPasswordToken = (token: string): { userId: string; email: string } => {
  try {
    return jwt.verify(token, config.JWT_SECRET) as { userId: string; email: string };
  } catch (error) {
    throw new Error("Token de restablecimiento inválido o expirado");
  }
};

export const generateEmailVerificationToken = (payload: { email: string; code: string }): string => {
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: '1h',
  });
};

export const verifyEmailVerificationToken = (token: string): { email: string; code: string } => {
  try {
    return jwt.verify(token, config.JWT_SECRET) as { email: string; code: string };
  } catch (error) {
    throw new Error("Token de verificación inválido o expirado");
  }
};

export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};