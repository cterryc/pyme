import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../constants/HttpStatus";
import apiResponse from "../../utils/apiResponse.utils";
import AuthService from "./service";
import { IRegisterPayload, ILoginPayload } from "./interfaces";

export default class AuthController { 
    private static authService = new AuthService();

    static register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const payload: IRegisterPayload = req.body;
            const result = await AuthController.authService.register(payload);
            res.status(HttpStatus.CREATED).json(apiResponse(true, result));
        } catch (err: any) {
            const status = err.status || HttpStatus.SERVER_ERROR;
            const response = apiResponse(false, err.message || "Registration failed");
            res.status(status).json(response);
        }
    };
}