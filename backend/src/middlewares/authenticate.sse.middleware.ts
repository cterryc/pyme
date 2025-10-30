import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config/enviroment.config";

/**
 * Middleware de autenticación específico para SSE (Server-Sent Events)
 * En lugar de enviar JSON cuando falla la autenticación, cierra la conexión
 * para que el EventSource del cliente pueda manejar el error correctamente
 * 
 * Acepta el token únicamente desde el header Authorization por seguridad:
 * - Header Authorization: Bearer {token}
 */
export default async function authenticateSSE(
    req: Request,
    res: Response,
    next: NextFunction
) {
    let token: string | undefined;

    
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
    ) {
        token = req.headers.authorization.substring(7);
    }


    if (!token) {
        console.error("[SSE Auth] ❌ No se proporcionó token de autorización en el header");
        console.error("[SSE Auth] Headers recibidos:", {
            authorization: req.headers.authorization || 'No proporcionado',
            origin: req.headers.origin,
        });

        // Limpiar URLs removiendo barras finales
        const cleanUrl = (url: string | undefined) => {
            if (!url) return null;
            return url.replace(/\/$/, '');
        };

        // Asegurar headers CORS dinámicos según entorno
        const allowedOrigins =
            process.env.NODE_ENV === "production"
                ? [cleanUrl(process.env.FRONTEND_URL)].filter(Boolean)
                : ["http://localhost:5173", "http://localhost:5174"];

        const origin = req.headers.origin || "";
        const cleanOrigin = cleanUrl(origin);
        
        if (allowedOrigins.includes(cleanOrigin)) {
            res.setHeader("Access-Control-Allow-Origin", origin);
        }
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

        // Limpiar URLs removiendo barras finales
        const cleanUrl = (url: string | undefined) => {
            if (!url) return null;
            return url.replace(/\/$/, '');
        };

        // Asegurar headers CORS dinámicos según entorno
        const allowedOrigins =
            process.env.NODE_ENV === "production"
                ? [cleanUrl(process.env.FRONTEND_URL)].filter(Boolean)
                : ["http://localhost:5173", "http://localhost:5174"];

        const origin = req.headers.origin || "";
        const cleanOrigin = cleanUrl(origin);
        
        if (allowedOrigins.includes(cleanOrigin)) {
            res.setHeader("Access-Control-Allow-Origin", origin);
        }
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.status(401).end();
        return;
    }
}