"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_utils_1 = require("../../utils/bcrypt.utils");
const data_source_1 = require("../../config/data-source");
const User_entity_1 = require("../../entities/User.entity");
const HttpError_utils_1 = __importDefault(require("../../utils/HttpError.utils"));
const HttpStatus_1 = require("../../constants/HttpStatus");
const jwt_utils_1 = require("../../utils/jwt.utils");
const helpers_1 = require("./helpers");
const enviroment_config_1 = __importDefault(require("../../config/enviroment.config"));
class AuthService {
    constructor() {
        this.userRepo = data_source_1.AppDataSource.getRepository(User_entity_1.User);
    }
    async register(payload) {
        const normalizedEmail = payload.email.toLowerCase().trim();
        const existingUser = await this.userRepo.findOne({
            where: { email: normalizedEmail },
        });
        if (existingUser) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.BAD_REQUEST, "El email ya está en uso");
        }
        const hashedPassword = await bcrypt_utils_1.BcryptUtils.createHash(payload.password);
        const verificationCode = (0, jwt_utils_1.generateVerificationCode)();
        const newUser = await this.userRepo.save({
            ...payload,
            email: normalizedEmail,
            password: hashedPassword,
            emailVerificationToken: verificationCode, // Guardar el código
        });
        const { id, role } = newUser;
        const tokenPayload = { id, role };
        const token = (0, jwt_utils_1.generateToken)(tokenPayload);
        // Enviar email con el código
        await this.sendVerificationEmail(normalizedEmail, verificationCode);
        return { token };
    }
    async login(payload) {
        const normalizedEmail = payload.email.toLowerCase().trim();
        const user = await this.userRepo.findOne({
            where: { email: normalizedEmail },
        });
        if (!user) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.UNAUTHORIZED, "Credenciales inválidas");
        }
        const isPasswordValid = await bcrypt_utils_1.BcryptUtils.isValidPassword(user, payload.password);
        if (!isPasswordValid) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.UNAUTHORIZED, "Credenciales inválidas");
        }
        const token = (0, jwt_utils_1.generateToken)({
            id: user.id,
            role: user.role,
        });
        return { token };
    }
    async sendVerificationEmail(email, code) {
        const url = "https://api.brevo.com/v3/smtp/email";
        const options = {
            method: "POST",
            headers: {
                accept: "application/json",
                "content-type": "application/json",
                "api-key": enviroment_config_1.default.BREVO_API_KEY,
            },
            body: JSON.stringify({
                sender: { name: "Pyme", email: "nc.equipo21@gmail.com" },
                replyTo: { email: "nc.equipo21@gmail.com", name: "Equipo Pyme" },
                to: [{ email: email, name: "Nuevo Usuario" }],
                subject: "Verifica tu email - Pyme",
                htmlContent: (0, helpers_1.htmlWelcomeContent)(code),
            }),
        };
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                console.error("Error al enviar email de verificación:", await response.text());
            }
        }
        catch (err) {
            console.error("Excepción al enviar email de verificación:", err);
        }
    }
    async updateUser(userId, payload) {
        // Buscar el usuario
        const user = await this.userRepo.findOne({
            where: { id: userId },
            select: [
                "id",
                "email",
                "password",
                "firstName",
                "lastName",
                "phone",
                "role",
                "isEmailVerified",
                "profileImage",
                "createdAt",
                "updatedAt",
            ],
        });
        if (!user) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.NOT_FOUND, "Usuario no encontrado");
        }
        // Verificar que currentPassword sea requerido para cambios sensibles
        const isSensitiveChange = payload.email || payload.newPassword;
        if (isSensitiveChange && !payload.currentPassword) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.BAD_REQUEST, "La contraseña actual es requerida para cambiar email o contraseña");
        }
        // Verificar contraseña actual si se intenta cambiar email o contraseña
        if (isSensitiveChange) {
            const isPasswordValid = await bcrypt_utils_1.BcryptUtils.isValidPassword(user, payload.currentPassword);
            if (!isPasswordValid) {
                throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.UNAUTHORIZED, "La contraseña actual es incorrecta");
            }
        }
        // Si se intenta cambiar el email, verificar que no esté en uso
        if (payload.email) {
            const normalizedEmail = payload.email.toLowerCase().trim();
            if (normalizedEmail !== user.email) {
                const existingUser = await this.userRepo.findOne({
                    where: { email: normalizedEmail },
                });
                if (existingUser) {
                    throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.BAD_REQUEST, "El email ya está en uso por otro usuario");
                }
                user.email = normalizedEmail;
                user.isEmailVerified = false; // Resetear verificación de email
            }
        }
        // Actualizar contraseña si se proporciona
        if (payload.newPassword) {
            user.password = await bcrypt_utils_1.BcryptUtils.createHash(payload.newPassword);
        }
        // Actualizar otros campos
        if (payload.firstName !== undefined) {
            user.firstName = payload.firstName;
        }
        if (payload.lastName !== undefined) {
            user.lastName = payload.lastName;
        }
        if (payload.phone !== undefined) {
            user.phone = payload.phone || undefined;
        }
        if (payload.profileImage !== undefined) {
            user.profileImage = payload.profileImage || undefined;
        }
        // Guardar cambios
        const updatedUser = await this.userRepo.save(user);
        // Retornar DTO sin password
        return {
            id: updatedUser.id,
            email: updatedUser.email,
            firstName: updatedUser.firstName || null,
            lastName: updatedUser.lastName || null,
            phone: updatedUser.phone || null,
            role: updatedUser.role,
            isEmailVerified: updatedUser.isEmailVerified,
            profileImage: updatedUser.profileImage || null,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt,
        };
    }
    async forgotPassword(email) {
        const normalizedEmail = email.toLowerCase().trim();
        const user = await this.userRepo.findOne({
            where: { email: normalizedEmail },
            select: ["id", "email", "firstName"],
        });
        if (!user) {
            // Nota: Por seguridad, no se revela si el email existe o no
            return;
        }
        const resetToken = (0, jwt_utils_1.generateResetPasswordToken)({
            userId: user.id,
            email: user.email,
        });
        const resetUrl = `${enviroment_config_1.default.FRONTEND_URL}/reset-password?token=${resetToken}`;
        const userName = user.firstName || "Usuario";
        // Enviar email con Brevo
        const url = "https://api.brevo.com/v3/smtp/email";
        const options = {
            method: "POST",
            headers: {
                accept: "application/json",
                "content-type": "application/json",
                "api-key": enviroment_config_1.default.BREVO_API_KEY,
            },
            body: JSON.stringify({
                sender: { name: "Pyme", email: "nc.equipo21@gmail.com" },
                replyTo: { email: "nc.equipo21@gmail.com", name: "Equipo de Soporte" },
                to: [{ email: user.email, name: userName }],
                subject: "Restablece tu contraseña - Pyme",
                htmlContent: (0, helpers_1.htmlResetPasswordContent)(resetUrl, userName),
            }),
        };
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                console.error("Error al enviar email de restablecimiento:", await response.text());
                // Opcional: lanzar error si es crítico, pero comúnmente se loguea y se responde OK por seguridad
            }
        }
        catch (err) {
            console.error("Excepción al enviar email de restablecimiento:", err);
        }
    }
    async resetPassword(token, newPassword) {
        let payload;
        try {
            payload = (0, jwt_utils_1.verifyResetPasswordToken)(token);
        }
        catch (error) {
            console.error("Error al verificar token de restablecimiento:", error);
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.UNAUTHORIZED, "Token inválido o expirado");
        }
        const user = await this.userRepo.findOne({
            where: { id: payload.userId, email: payload.email },
            select: ["id", "password"],
        });
        if (!user) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.UNAUTHORIZED, "Token inválido");
        }
        // Evitar reutilizar la misma contraseña (opcional, pero recomendado)
        const isSamePassword = await bcrypt_utils_1.BcryptUtils.isValidPassword(user, newPassword);
        if (isSamePassword) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.BAD_REQUEST, "La nueva contraseña debe ser diferente a la actual");
        }
        const hashedPassword = await bcrypt_utils_1.BcryptUtils.createHash(newPassword);
        await this.userRepo.update(user.id, { password: hashedPassword });
    }
    async verifyEmail(payload) {
        const normalizedEmail = payload.email.toLowerCase().trim();
        const user = await this.userRepo.findOne({
            where: { email: normalizedEmail },
            select: ["id", "email", "isEmailVerified"],
        });
        if (!user) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.NOT_FOUND, "Usuario no encontrado");
        }
        if (user.isEmailVerified) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.BAD_REQUEST, "El email ya está verificado");
        }
        // Aquí validamos el código
        // Como usamos JWT sin guardar en BD, necesitamos que el frontend envíe el token
        // O validamos directamente el código si lo guardamos en BD
        // Por simplicidad, voy a guardar el código en la BD
        const storedCode = await this.userRepo.findOne({
            where: { email: normalizedEmail },
            select: ["emailVerificationToken"],
        });
        if (!storedCode?.emailVerificationToken) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.BAD_REQUEST, "No hay código de verificación pendiente");
        }
        if (storedCode.emailVerificationToken !== payload.code) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.BAD_REQUEST, "Código de verificación incorrecto");
        }
        await this.userRepo.update(user.id, {
            isEmailVerified: true,
            emailVerificationToken: undefined,
        });
    }
    async resendVerification(email) {
        const normalizedEmail = email.toLowerCase().trim();
        const user = await this.userRepo.findOne({
            where: { email: normalizedEmail },
            select: ["id", "email", "isEmailVerified"],
        });
        if (!user) {
            // Por seguridad, no revelamos si el email existe
            return;
        }
        if (user.isEmailVerified) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.BAD_REQUEST, "El email ya está verificado");
        }
        const verificationCode = (0, jwt_utils_1.generateVerificationCode)();
        // Guardar el código en la base de datos
        await this.userRepo.update(user.id, {
            emailVerificationToken: verificationCode,
        });
        await this.sendVerificationEmail(normalizedEmail, verificationCode);
    }
}
exports.default = AuthService;
//# sourceMappingURL=service.js.map