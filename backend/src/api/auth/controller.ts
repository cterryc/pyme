import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../constants/HttpStatus";
import apiResponse from "../../utils/apiResponse.utils";
import AuthService from "./service";
import { IRegisterPayload, ILoginPayload } from "./interfaces";

export default class AuthController {
  private static authService = new AuthService();

  static login = async (req: Request, res: Response, next: NextFunction) => {
    // console.log("req.body Login ==>", req.body);
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
      const { normalizedEmail, password } = req.body;

      const email = normalizedEmail.toLowerCase().trim();

      const payload: IRegisterPayload = { email, password };

      const result = await AuthController.authService.register(payload);
      res.status(HttpStatus.CREATED).json(apiResponse(true, result));
    } catch (err: any) {
      next(err);
    }
  };
}
