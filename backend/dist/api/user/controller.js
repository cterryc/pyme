"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatus_1 = require("../../constants/HttpStatus");
const apiResponse_utils_1 = __importDefault(require("../../utils/apiResponse.utils"));
const service_1 = __importDefault(require("./service"));
class AuthController {
}
_a = AuthController;
AuthController.authService = new service_1.default();
AuthController.updateUser = async (req, res, next) => {
    try {
        // El userId viene del token JWT decodificado en el middleware authenticate
        const userId = res.locals.user.id;
        const payload = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone,
            profileImage: req.body.profileImage,
            email: req.body.email,
            newPassword: req.body.newPassword,
            currentPassword: req.body.currentPassword,
        };
        const result = await _a.authService.updateUser(userId, payload);
        res.status(HttpStatus_1.HttpStatus.OK).json((0, apiResponse_utils_1.default)(true, result));
    }
    catch (err) {
        next(err);
    }
};
AuthController.getProfile = async (req, res, next) => {
    try {
        // Si hay userId en params, es admin buscando otro perfil
        // Si no hay userId, es el usuario viendo su propio perfil
        const userId = req.params.userId || res.locals.user.id;
        const result = await _a.authService.getUserData(userId);
        res.status(HttpStatus_1.HttpStatus.OK).json((0, apiResponse_utils_1.default)(true, result));
    }
    catch (err) {
        next(err);
    }
};
AuthController.deleteUser = async (req, res, next) => {
    try {
        // Si hay userId en params, es admin eliminando otro usuario
        // Si no hay userId, es el usuario eliminando su propia cuenta
        const userId = req.params.userId || res.locals.user.id;
        const requestingUserId = res.locals.user.id;
        const requestingUserRole = res.locals.user.role;
        const result = await _a.authService.deleteUser(userId, requestingUserId, requestingUserRole);
        res.status(HttpStatus_1.HttpStatus.OK).json((0, apiResponse_utils_1.default)(true, result));
    }
    catch (err) {
        next(err);
    }
};
AuthController.getAllUsers = async (req, res, next) => {
    try {
        const query = {
            page: req.query.page ? parseInt(req.query.page) : undefined,
            limit: req.query.limit ? parseInt(req.query.limit) : undefined,
            role: req.query.role,
            search: req.query.search,
            isActive: req.query.isActive === "true" ? true : req.query.isActive === "false" ? false : undefined,
        };
        const result = await _a.authService.getAllUsers(query);
        res.status(HttpStatus_1.HttpStatus.OK).json((0, apiResponse_utils_1.default)(true, result));
    }
    catch (err) {
        next(err);
    }
};
exports.default = AuthController;
