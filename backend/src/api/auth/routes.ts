import { Router } from "express";
import AuthController from "./controller";
import {
    userRegisterPayloadValidator,
    userLoginPayloadValidator,
} from "./validator";
import schemaValidator from "../../middlewares/schemaValidators.middlewares";
//import { authenticate } from "../../middleware/authenticate.middleware";

const authRouter = Router();

// Public routes
authRouter.post(
    "/register",
    schemaValidator(userRegisterPayloadValidator, null),
    AuthController.register
);

// authRouter.post(
//     "/login",
//     schemaValidator(userLoginPayloadValidator, null),
//     AuthController.login
// );

// Protected routes
//authRouter.get("/profile", authenticate, AuthController.getProfile);

export default authRouter;
