import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../constants/HttpStatus";
import apiResponse from "../../utils/apiResponse.utils";
import AuthService from "./service";
import { IRegisterPayload, ILoginPayload } from "./interfaces";

export default class AuthController { 
    private static authService = new AuthService();

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