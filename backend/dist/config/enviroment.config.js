"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// LIBRARIES
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const config = {
    // Server
    PORT: process.env.PORT || "8082",
    NODE_ENV: process.env.NODE_ENV || "development",
    MODE: process.env.MODE || "FORK",
    // Database
    DB_HOST: process.env.DB_HOST || "localhost",
    DB_PORT: parseInt(process.env.DB_PORT || "5432"),
    DB_USERNAME: process.env.DB_USERNAME || "postgres",
    DB_PASSWORD: process.env.DB_PASSWORD || "12345",
    DB_NAME: process.env.DB_NAME || "fintech_credit",
    DB_SSL: process.env.DB_SSL === "true",
    // Supabase
    SUPABASE_URL: process.env.SUPABASE_URL || "",
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || "",
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    SUPABASE_STORAGE_BUCKET: process.env.SUPABASE_STORAGE_BUCKET || "credit-documents",
    // JWT
    JWT_SECRET: process.env.JWT_SECRET ?? "change-this-secret",
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
    SESSION_KEY: process.env.SESSION_KEY || "",
    // OAuth
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL ||
        "http://localhost:8082/api/auth/google/callback",
    // Frontend
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
    // File Upload
    MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || "10485760"), // 10MB default
    // KYC/AML (Optional)
    KYC_API_KEY: process.env.KYC_API_KEY || "",
    KYC_API_URL: process.env.KYC_API_URL || "",
    // Breo APi Key
    BREVO_API_KEY: process.env.BREVO_API_KEY || "",
    // Backend URL
    BACKEND_URL: process.env.BACKEND_URL || "",
    // Backend Firma
    BACKEND_FIRMA: process.env.BACKEND_FIRMA || ""
};
exports.default = config;
//# sourceMappingURL=enviroment.config.js.map