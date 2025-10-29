"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const HttpStatus_1 = __importDefault(require("../constants/HttpStatus"));
const apiResponse_utils_1 = __importDefault(require("../utils/apiResponse.utils"));
const schemaValidator = (schema, paramsSchema) => {
    return async (req, res, next) => {
        try {
            if (schema) {
                schema.parse(req.body);
            }
            if (paramsSchema) {
                if (req.params.id) {
                    paramsSchema.parse(req.params.id);
                }
                else if (req.params.token) {
                    paramsSchema.parse(req.params.token);
                }
            }
            return next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const response = (0, apiResponse_utils_1.default)(false, error.issues.map((issue) => ({
                    path: issue.path[0],
                    message: issue.message,
                })));
                res.status(HttpStatus_1.default.BAD_REQUEST).json(response);
                return;
            }
            const response = (0, apiResponse_utils_1.default)(false, {
                message: "Internal server error",
            });
            res.status(HttpStatus_1.default.SERVER_ERROR).json(response);
            return;
        }
    };
};
exports.default = schemaValidator;
