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
class AuthService {
    constructor() {
        this.userRepo = data_source_1.AppDataSource.getRepository(User_entity_1.User);
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
    async getUserData(userId) {
        const user = await this.userRepo.findOne({
            where: { id: userId },
            select: [
                "id",
                "email",
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
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName || null,
            lastName: user.lastName || null,
            phone: user.phone || null,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
            profileImage: user.profileImage || null,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
    async deleteUser(userId, requestingUserId, requestingUserRole) {
        const user = await this.userRepo.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.NOT_FOUND, "Usuario no encontrado");
        }
        // Verificar permisos: solo puede eliminar su propia cuenta o ser ADMIN
        if (userId !== requestingUserId && requestingUserRole !== "Admin") {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.FORBIDDEN, "No tienes permisos para eliminar este usuario");
        }
        // Soft delete
        await this.userRepo.softDelete(userId);
        return {
            message: "Usuario eliminado exitosamente",
        };
    }
    async getAllUsers(query) {
        const page = query.page || 1;
        const limit = query.limit || 10;
        const skip = (page - 1) * limit;
        // Construir query con filtros
        const queryBuilder = this.userRepo
            .createQueryBuilder("user")
            .select([
            "user.id",
            "user.email",
            "user.firstName",
            "user.lastName",
            "user.phone",
            "user.role",
            "user.isEmailVerified",
            "user.isActive",
            "user.profileImage",
            "user.createdAt",
            "user.updatedAt",
        ])
            .where("user.deletedAt IS NULL");
        // Filtro por role
        if (query.role) {
            queryBuilder.andWhere("user.role = :role", { role: query.role });
        }
        // Filtro por isActive
        if (query.isActive !== undefined) {
            queryBuilder.andWhere("user.isActive = :isActive", { isActive: query.isActive });
        }
        // Búsqueda por email o nombre
        if (query.search) {
            queryBuilder.andWhere("(user.email ILIKE :search OR user.firstName ILIKE :search OR user.lastName ILIKE :search)", { search: `%${query.search}%` });
        }
        // Ordenar por fecha de creación (más recientes primero)
        queryBuilder.orderBy("user.createdAt", "DESC");
        // Contar total
        const total = await queryBuilder.getCount();
        // Aplicar paginación
        const users = await queryBuilder.skip(skip).take(limit).getMany();
        // Mapear a DTO
        const usersDTO = users.map((user) => ({
            id: user.id,
            email: user.email,
            firstName: user.firstName || null,
            lastName: user.lastName || null,
            phone: user.phone || null,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
            profileImage: user.profileImage || null,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }));
        return {
            users: usersDTO,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
}
exports.default = AuthService;
//# sourceMappingURL=service.js.map