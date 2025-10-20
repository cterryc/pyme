import 'reflect-metadata';
import ExpressAppCreator from "./config/createApp";
import MiddlewaresConfig from "./config/middlewares.config";
import apiRouter from "./routers";
import { Request, Response, NextFunction } from "express";
import HttpError from './utils/HttpError.utils';
import apiResponse from './utils/apiResponse.utils';


(async () => {
  try {
    const appCreator = new ExpressAppCreator();
    const app = await appCreator.createExpressApp();

    
    MiddlewaresConfig.config(app);

  
    app.use("/api", apiRouter);

  
    app.use((err: HttpError, req: Request, res: Response) => {
      console.error("Error capturado:", err);

      const status = err.status || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json(apiResponse(false, { message }));
    });

  } catch (error) {
    console.error("❌ Error al iniciar la aplicación:", error);
    process.exit(1);
  }
})();
