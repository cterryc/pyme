// Extensión de tipos para Express con Multer
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      files?: any;
      file?: any;
    }
  }
}

export {};
