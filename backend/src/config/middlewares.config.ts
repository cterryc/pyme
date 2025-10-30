import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import hpp from "hpp";
import { rootPath } from "../utils/path.utils";

/**
 * Configures the middleware for the Express application.
 * @param app - The Express application instance.
 */
export default class MiddlewareConfig {
  /**
   * Configures the middleware for the Express application.
   * @param app - The Express application instance.
   * @description This method sets up various middleware for the Express application, including:
   * - Security headers (Helmet)
   * - Rate limiting (DDoS protection)
   * - Compression
   * - CORS configuration to allow cross-origin requests from the specified origin
   * - Serving static files from the "src/public" directory
   * - Parsing cookies
   * - Parsing JSON and URL-encoded request bodies
   * - Serving the Swagger UI for API documentation
   */
  static config(app: express.Application): void {
    // 🔒 Helmet - Security HTTP Headers
    app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
          },
        },
        hsts: {
          maxAge: 31536000, // 1 año
          includeSubDomains: true,
          preload: true,
        },
      })
    );

    // 🚦 Rate Limiting - General API Protection
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 100, // Máximo 100 requests por ventana
      message: "Too many requests from this IP, please try again later.",
      standardHeaders: true,
      legacyHeaders: false,
    });
    app.use("/api/" as any, limiter as any);

    // 🔐 Rate Limiting - Autenticación (más estricto)
    const authLimiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 10, // Solo 10 intentos
      message: "Too many login attempts, please try again later.",
      standardHeaders: true,
      legacyHeaders: false,
    });
    app.use("/api/auth/login" as any, authLimiter as any);
    app.use("/api/auth/register" as any, authLimiter as any);

    // 📦 Compresión de respuestas
    app.use(compression());

    // 🛡️ Protección contra HTTP Parameter Pollution
    app.use(hpp());

    // 🌐 CORS dinámico según entorno
    const allowedOrigins =
      process.env.NODE_ENV === "production"
        ? [process.env.FRONTEND_URL || "https://your-domain.com"]
        : ["http://localhost:5173", "http://localhost:5174"];

    app.use(
      cors({
        origin: (origin, callback) => {
          // Permitir requests sin origin (mobile apps, Postman)
          if (!origin) return callback(null, true);

          if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
          } else {
            callback(
              new Error(
                "The CORS policy for this site does not allow access from the specified Origin."
              )
            );
          }
        },
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
        optionsSuccessStatus: 204,
        credentials: true,
        allowedHeaders: [
          "Content-Type",
          "Authorization",
          "Content-Disposition",
          "Cache-Control",
        ],
      })
    );
    app.use(express.static(path.join(process.cwd(), "src", "public")));
    app.use(cookieParser());

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    const swaggerOptions = {
      definition: {
        openapi: "3.0.1",
        info: {
          title: "Fintech Credit Platform API",
          description:
            "API para plataforma de solicitud de créditos para PYMEs",
          version: "1.0.0",
        },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      apis: [`${rootPath}/docs/**/*.yaml`],
    };

    const specs = swaggerJSDoc(swaggerOptions);
    app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
  }
}
