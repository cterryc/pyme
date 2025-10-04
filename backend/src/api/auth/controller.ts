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
      const payload: ILoginPayload = req.body;
      const result = await AuthController.authService.login(payload);
      res.status(HttpStatus.OK).json(apiResponse(true, result));
    } catch (err: any) {
      const status = err.status || HttpStatus.SERVER_ERROR;
      const response = apiResponse(false, err.message || "Login failed");
      res.status(status).json(response);
    }
  };
}

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
}

