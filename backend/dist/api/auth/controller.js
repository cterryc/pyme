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
AuthController.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const payload = { email, password };
        const result = await _a.authService.login(payload);
        res.status(HttpStatus_1.HttpStatus.OK).json((0, apiResponse_utils_1.default)(true, result));
    }
    catch (err) {
        next(err);
    }
};
AuthController.register = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const payload = { email, password };
        const result = await _a.authService.register(payload);
        res.status(HttpStatus_1.HttpStatus.CREATED).json((0, apiResponse_utils_1.default)(true, result));
    }
    catch (err) {
        next(err);
    }
};
AuthController.updateUser = async (req, res, next) => {
    try {
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
AuthController.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const payload = { email };
        await _a.authService.forgotPassword(payload.email);
        // Siempre responde OK por seguridad, incluso si el email no existe
        res.status(HttpStatus_1.HttpStatus.OK).json((0, apiResponse_utils_1.default)(true, null));
    }
    catch (err) {
        next(err);
    }
};
AuthController.resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;
        const payload = { token, newPassword };
        await _a.authService.resetPassword(payload.token, payload.newPassword);
        res.status(HttpStatus_1.HttpStatus.OK).json((0, apiResponse_utils_1.default)(true, null));
    }
    catch (err) {
        next(err);
    }
};
AuthController.verifyEmail = async (req, res, next) => {
    try {
        const { email, code } = req.body;
        const payload = { email, code };
        await _a.authService.verifyEmail(payload);
        res
            .status(HttpStatus_1.HttpStatus.OK)
            .json((0, apiResponse_utils_1.default)(true, { message: "Email verificado exitosamente" }));
    }
    catch (err) {
        next(err);
    }
};
AuthController.resendVerification = async (req, res, next) => {
    try {
        const { email } = req.body;
        const payload = { email };
        await _a.authService.resendVerification(payload.email);
        res
            .status(HttpStatus_1.HttpStatus.OK)
            .json((0, apiResponse_utils_1.default)(true, { message: "Código de verificación reenviado" }));
    }
    catch (err) {
        next(err);
    }
};
exports.default = AuthController;
