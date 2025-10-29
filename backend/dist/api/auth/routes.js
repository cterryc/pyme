"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = __importDefault(require("./controller"));
const validator_1 = require("./validator");
const schemaValidators_middlewares_1 = __importDefault(require("../../middlewares/schemaValidators.middlewares"));
const authenticate_middleware_1 = __importDefault(require("../../middlewares/authenticate.middleware"));
const authRouter = (0, express_1.Router)();
// Public routes
authRouter.post("/register", (0, schemaValidators_middlewares_1.default)(validator_1.userRegisterPayloadValidator, null), controller_1.default.register);
authRouter.post("/login", (0, schemaValidators_middlewares_1.default)(validator_1.userLoginPayloadValidator, null), controller_1.default.login);
authRouter.post("/forgot-password", (0, schemaValidators_middlewares_1.default)(validator_1.forgotPasswordValidator, null), controller_1.default.forgotPassword);
authRouter.post("/reset-password", (0, schemaValidators_middlewares_1.default)(validator_1.resetPasswordValidator, null), controller_1.default.resetPassword);
authRouter.post("/verify-email", (0, schemaValidators_middlewares_1.default)(validator_1.verifyEmailValidator, null), controller_1.default.verifyEmail);
authRouter.post("/resend-verification", (0, schemaValidators_middlewares_1.default)(validator_1.resendVerificationValidator, null), controller_1.default.resendVerification);
// Protected routes
authRouter.patch("/profile", authenticate_middleware_1.default, (0, schemaValidators_middlewares_1.default)(validator_1.userUpdatePayloadValidator, null), controller_1.default.updateUser);
exports.default = authRouter;
