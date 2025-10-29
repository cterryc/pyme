import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config/enviroment.config";

/**
 * Middleware de autenticación específico para SSE (Server-Sent Events)
 * En lugar de enviar JSON cuando falla la autenticación, cierra la conexión
 * para que el EventSource del cliente pueda manejar el error correctamente
 * 
 * Acepta el token de dos formas:
 * 1. Header Authorization: Bearer {token}
 * 2. Query parameter: ?token={token}
 */
export default async function authenticateSSE(
    req: Request,
    res: Response,
    next: NextFunction
) {
    let token: string | undefined;

    // Intentar obtener token del header Authorization
    if (
        req.headers.authorization &&
        req.headers.authorization.indexOf("Bearer ") !== -1
    ) {
        token = req.headers.authorization.substring(7);
    }
    // Si no está en el header, intentar obtenerlo del query parameter
    else if (req.query.token && typeof req.query.token === 'string') {
        token = req.query.token;
    }

    // Si no se encontró token en ningún lado
    if (!token) {
        console.error("[SSE Auth] ❌ No se proporcionó token de autorización");
        console.error("[SSE Auth] Headers recibidos:", req.headers);
        console.error("[SSE Auth] Query params recibidos:", req.query);

        // Asegurar headers CORS antes de cerrar
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.status(401).end();
        return;
    }

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