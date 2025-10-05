import { Request, Response, NextFunction } from "express";
import  { UserRole }  from "../constants/Roles";
import apiResponse from "../utils/apiResponse.utils";
import HTTP_STATUS from "../constants/HttpStatus";

const authorizeRoles = (roles: UserRole[]) => {
    return (_req: Request, res: Response, next: NextFunction) => {
        const userRole = res.locals.user.role;
        if (roles.includes(userRole) || userRole == UserRole.ADMIN) { // admins always should be authorized, right?
            res.locals.user.role = userRole;
            next();
        } else {
            const response = apiResponse(false, {
                message: "You are not authorized to access this resource",
            });
            res.status(HTTP_STATUS.FORBIDDEN).json(response);
        }
    };
};

export default authorizeRoles;
