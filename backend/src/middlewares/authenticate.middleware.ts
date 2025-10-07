import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import HTTP_STATUS from "../constants/HttpStatus";
import apiResponse from "../utils/apiResponse.utils";
import config from "../config/enviroment.config";

export default async function authenticate(
    req: Request,
    res: Response,
    next: NextFunction
) {
    let token: string | undefined;

    if (
        !req.headers.authorization ||
        req.headers.authorization.indexOf("Bearer ") === -1
    ) {
        const response =  {message: "El token de autenticación es obligatorio"};
        res.status(HTTP_STATUS.UNAUTHORIZED).json(apiResponse(false, response));
        return;
    }

    token = req.headers.authorization?.substring(7);
    try {
        const decodedToken = jwt.verify(token, config.JWT_SECRET);
        const tokenData = JSON.stringify(decodedToken);

        const user = JSON.parse(tokenData);

        res.locals.user = user;
        next();
    } catch (error) {
        const response =  {message: "El token de autenticación no es válido"};
        res.status(HTTP_STATUS.UNAUTHORIZED).json(apiResponse(false, response));
        return;
    }
}
