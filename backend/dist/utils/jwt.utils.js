"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVerificationCode = exports.verifyEmailVerificationToken = exports.generateEmailVerificationToken = exports.verifyResetPasswordToken = exports.generateResetPasswordToken = exports.decodeToken = exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const enviroment_config_1 = __importDefault(require("../config/enviroment.config"));
/**
 * Generate JWT token
 */
const generateToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, enviroment_config_1.default.JWT_SECRET, {
        expiresIn: enviroment_config_1.default.JWT_EXPIRES_IN,
    });
};
exports.generateToken = generateToken;
/**
 * Verify JWT token
 */
const verifyToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, enviroment_config_1.default.JWT_SECRET);
    }
    catch (error) {
        console.error("Token verification failed:", error);
        throw new Error("Token inválido o expirado");
    }
};
exports.verifyToken = verifyToken;
/**
 * Decode JWT token without verification
 */
const decodeToken = (token) => {
    try {
        return jsonwebtoken_1.default.decode(token);
    }
    catch (error) {
        console.error("Token decoding failed:", error);
        return null;
    }
};
exports.decodeToken = decodeToken;
// utils/jwt.utils.ts (agrega al final del archivo)
const generateResetPasswordToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, enviroment_config_1.default.JWT_SECRET, {
        expiresIn: '1h',
    });
};
exports.generateResetPasswordToken = generateResetPasswordToken;
const verifyResetPasswordToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, enviroment_config_1.default.JWT_SECRET);
    }
    catch (error) {
        console.error("Token de restablecimiento inválido o expirado:", error);
        throw new Error("Token de restablecimiento inválido o expirado");
    }
};
exports.verifyResetPasswordToken = verifyResetPasswordToken;
const generateEmailVerificationToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, enviroment_config_1.default.JWT_SECRET, {
        expiresIn: '1h',
    });
};
exports.generateEmailVerificationToken = generateEmailVerificationToken;
const verifyEmailVerificationToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, enviroment_config_1.default.JWT_SECRET);
    }
    catch (error) {
        console.error("Token de verificación inválido o expirado:", error);
        throw new Error("Token de verificación inválido o expirado");
    }
};
exports.verifyEmailVerificationToken = verifyEmailVerificationToken;
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
exports.generateVerificationCode = generateVerificationCode;
//# sourceMappingURL=jwt.utils.js.map