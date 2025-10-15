import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../constants/HttpStatus";
import apiResponse from "../../utils/apiResponse.utils";
import AuthService from "./service";
import {
  IGetUsersQuery,
  IUpdateUserPayload,
} from "./interfaces";
import { UserRole } from "../../constants/Roles";

export default class AuthController {
  private static authService = new AuthService();

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

  static getProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // Si hay userId en params, es admin buscando otro perfil
      // Si no hay userId, es el usuario viendo su propio perfil
      const userId = req.params.userId || res.locals.user.id;

      const result = await AuthController.authService.getUserData(userId);

      res.status(HttpStatus.OK).json(apiResponse(true, result));
    } catch (err: any) {
      next(err);
    }
  };

  static deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // Si hay userId en params, es admin eliminando otro usuario
      // Si no hay userId, es el usuario eliminando su propia cuenta
      const userId = req.params.userId || res.locals.user.id;
      const requestingUserId = res.locals.user.id;
      const requestingUserRole = res.locals.user.role;

      const result = await AuthController.authService.deleteUser(
        userId,
        requestingUserId,
        requestingUserRole
      );

      res.status(HttpStatus.OK).json(apiResponse(true, result));
    } catch (err: any) {
      next(err);
    }
  };
  static getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const query: IGetUsersQuery = {
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        role: req.query.role as UserRole | undefined,
        search: req.query.search as string | undefined,
        isActive: req.query.isActive === "true" ? true : req.query.isActive === "false" ? false : undefined,
      };

      const result = await AuthController.authService.getAllUsers(query);

      res.status(HttpStatus.OK).json(apiResponse(true, result));
    } catch (err: any) {
      next(err);
    }
  };
}
