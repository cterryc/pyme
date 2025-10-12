import { Router } from "express";
import AuthController from "./controller";
import {
  userRegisterPayloadValidator,
  userLoginPayloadValidator,
  userUpdatePayloadValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} from "./validator";
import schemaValidator from "../../middlewares/schemaValidators.middlewares";
import authenticate from "../../middlewares/authenticate.middleware";

const authRouter = Router();

// Public routes
authRouter.post(
  "/register",
  schemaValidator(userRegisterPayloadValidator, null),
  AuthController.register
);

authRouter.post(
  "/login",
  schemaValidator(userLoginPayloadValidator, null),
  AuthController.login
);

authRouter.post(
  "/forgot-password",
  schemaValidator(forgotPasswordValidator, null),
  AuthController.forgotPassword
);

authRouter.post(
  "/reset-password",
  schemaValidator(resetPasswordValidator, null),
  AuthController.resetPassword
);

// Protected routes
authRouter.patch(
  "/profile",
  authenticate,
  schemaValidator(userUpdatePayloadValidator, null),
  AuthController.updateUser
);

export default authRouter;
