import { Router } from "express";
import AuthController from "./controller";
import {
  userUpdatePayloadValidator,
} from "./validator";
import schemaValidator from "../../middlewares/schemaValidators.middlewares";
import authenticate from "../../middlewares/authenticate.middleware";
import { validateUuid } from "../../middlewares/validateParamId.middleware";
import { UserRole } from "../../constants/Roles";
import authorizeRoles from "../../middlewares/authorization.middleware";

const userRouter = Router();

userRouter.get(
  "/profile",
  authenticate,
  AuthController.getProfile
);

userRouter.get(
  "/profile/:userId",
  authenticate,
  authorizeRoles([UserRole.ADMIN]),
  validateUuid,
  AuthController.getProfile
);

userRouter.patch(
  "/profile",
  authenticate,
  schemaValidator(userUpdatePayloadValidator, null),
  AuthController.updateUser
);

userRouter.delete(
  "/profile",
  authenticate,
  AuthController.deleteUser
);

userRouter.delete(
  "/profile/:userId",
  authenticate,
  authorizeRoles([UserRole.ADMIN]),
  validateUuid,
  AuthController.deleteUser
);

userRouter.get(
  "/users",
  authenticate,
  authorizeRoles([UserRole.ADMIN]),
  AuthController.getAllUsers
);

export default userRouter;
