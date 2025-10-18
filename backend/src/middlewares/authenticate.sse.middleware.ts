import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config/enviroment.config";

/**
 * Middleware de autenticación específico para SSE (Server-Sent Events)
 * En lugar de enviar JSON cuando falla la autenticación, cierra la conexión
 * para que el EventSource del cliente pueda manejar el error correctamente
 */
export default async function authenticateSSE(
    req: Request,
    res: Response,
    next: NextFunction
) {
    let token: string | undefined;

    // Verificar si existe el header Authorization
    if (
        !req.headers.authorization ||
        req.headers.authorization.indexOf("Bearer ") === -1
    ) {
        console.error("[SSE Auth] ❌ No se proporcionó token de autorización");
        console.error("[SSE Auth] Headers recibidos:", req.headers);
        
        // Asegurar headers CORS antes de cerrar
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.status(401).end();
        return;
    }

    token = req.headers.authorization?.substring(7);
    try {
        const decodedToken = jwt.verify(token, config.JWT_SECRET);
        const tokenData = JSON.stringify(decodedToken);
        const user = JSON.parse(tokenData);

        res.locals.user = user;
        console.log(`[SSE Auth] ✅ Usuario autenticado: ${user.id || user.email}`);
        next();
    } catch (error) {
        console.error("[SSE Auth] ❌ Token inválido:", error);
        
        // Asegurar headers CORS antes de cerrar
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.status(401).end();
        return;
    }
}
