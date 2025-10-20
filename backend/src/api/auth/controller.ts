import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../constants/HttpStatus";
import apiResponse from "../../utils/apiResponse.utils";
import AuthService from "./service";
import {
  IRegisterPayload,
  ILoginPayload,
  IUpdateUserPayload,
  IForgotPasswordPayload,
  IResetPasswordPayload,
  IVerifyEmailPayload,
  IResendVerificationPayload,
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

  static forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email } = req.body;
      const payload: IForgotPasswordPayload = { email };

      await AuthController.authService.forgotPassword(payload.email);
      // Siempre responde OK por seguridad, incluso si el email no existe
      res.status(HttpStatus.OK).json(apiResponse(true, null));
    } catch (err: any) {
      next(err);
    }
  };

  static resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { token, newPassword } = req.body;
      const payload: IResetPasswordPayload = { token, newPassword };

      await AuthController.authService.resetPassword(
        payload.token,
        payload.newPassword
      );
      res.status(HttpStatus.OK).json(apiResponse(true, null));
    } catch (err: any) {
      next(err);
    }
  };

  static verifyEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, code } = req.body;
      const payload: IVerifyEmailPayload = { email, code };

      await AuthController.authService.verifyEmail(payload);
      res
        .status(HttpStatus.OK)
        .json(apiResponse(true, { message: "Email verificado exitosamente" }));
    } catch (err: any) {
      next(err);
    }
  };

  static resendVerification = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email } = req.body;
      const payload: IResendVerificationPayload = { email };

      await AuthController.authService.resendVerification(payload.email);
      res
        .status(HttpStatus.OK)
        .json(
          apiResponse(true, { message: "Código de verificación reenviado" })
        );
    } catch (err: any) {
      next(err);
    }
  };
}
