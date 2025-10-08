import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../constants/HttpStatus";
import apiResponse from "../../utils/apiResponse.utils";
import AuthService from "./service";
import {
  IRegisterPayload,
  ILoginPayload,
  IUpdateUserPayload,
} from "./interfaces";

export default class AuthController {
  private static authService = new AuthService();

  static login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const payload: ILoginPayload = { email, password };

      const result = await AuthController.authService.login(payload);
      res.status(HttpStatus.OK).json(apiResponse(true, result));
    } catch (err: any) {
      next(err);
    }
  };

  static register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const payload: IRegisterPayload = { email, password };

      const result = await AuthController.authService.register(payload);
      await AuthController.authService.sendWelcomeEmail(email);
      res.status(HttpStatus.CREATED).json(apiResponse(true, result));
    } catch (err: any) {
      next(err);
    }
  };

  static updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // El userId viene del token JWT decodificado en el middleware authenticate
      const userId = res.locals.user.id;

      const payload: IUpdateUserPayload = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        profileImage: req.body.profileImage,
        email: req.body.email,
        newPassword: req.body.newPassword,
        currentPassword: req.body.currentPassword,
      };

      const result = await AuthController.authService.updateUser(
        userId,
        payload
      );

      res.status(HttpStatus.OK).json(apiResponse(true, result));
    } catch (err: any) {
      next(err);
    }
  };
}
