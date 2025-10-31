import { Request, Response, NextFunction } from 'express';
import HTTP_STATUS from '../constants/HttpStatus';
import apiResponse from '../utils/apiResponse.utils';

const { param, validationResult } = require('express-validator');

export const validationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const response =  {message: "El ID proporcionado no es un ID válido."};
        res.status(HTTP_STATUS.BAD_REQUEST).json(apiResponse(false, response));
        return;
    }
    next();
};

export const validateUuid = [
    param('id').isUUID().withMessage('El ID proporcionado no es un ID válido.'),
    validationErrors
];
