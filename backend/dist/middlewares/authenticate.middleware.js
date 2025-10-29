"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authenticate;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const HttpStatus_1 = __importDefault(require("../constants/HttpStatus"));
const apiResponse_utils_1 = __importDefault(require("../utils/apiResponse.utils"));
const enviroment_config_1 = __importDefault(require("../config/enviroment.config"));
async function authenticate(req, res, next) {
    let token;
    if (!req.headers.authorization ||
        req.headers.authorization.indexOf("Bearer ") === -1) {
        const response = { message: "El token de autenticación es obligatorio" };
        res.status(HttpStatus_1.default.UNAUTHORIZED).json((0, apiResponse_utils_1.default)(false, response));
        return;
    }
    token = req.headers.authorization?.substring(7);
    try {
        const decodedToken = jsonwebtoken_1.default.verify(token, enviroment_config_1.default.JWT_SECRET);
        const tokenData = JSON.stringify(decodedToken);
        const user = JSON.parse(tokenData);
        res.locals.user = user;
        next();
    }
    catch (error) {
        console.error("Token de autenticación no válido:", error);
        const response = { message: "El token de autenticación no es válido" };
        res.status(HttpStatus_1.default.UNAUTHORIZED).json((0, apiResponse_utils_1.default)(false, response));
        return;
    }
}
