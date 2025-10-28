"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUuid = exports.validationErrors = void 0;
const express_validator_1 = require("express-validator");
const HttpStatus_1 = __importDefault(require("../constants/HttpStatus"));
const apiResponse_utils_1 = __importDefault(require("../utils/apiResponse.utils"));
const validationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const response = { message: "El ID proporcionado no es un ID válido." };
        res.status(HttpStatus_1.default.BAD_REQUEST).json((0, apiResponse_utils_1.default)(false, response));
        return;
    }
    next();
};
exports.validationErrors = validationErrors;
exports.validateUuid = [
    (0, express_validator_1.param)('id').isUUID().withMessage('El ID proporcionado no es un ID válido.'),
    exports.validationErrors
];
//# sourceMappingURL=validateParamId.middleware.js.map