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
        throw new Error("Invalid or expired token");
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
