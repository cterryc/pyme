import 'reflect-metadata';
import express from "express";
import ExpressAppCreator from "./config/createApp";
import MiddlewaresConfig from "./config/middlewares.config";
import apiRouter from "./routers";
import { Request, Response, NextFunction } from "express";
import HttpError from './utils/HttpError.utils';
import apiResponse from './utils/apiResponse.utils';



const appCreator = new ExpressAppCreator();
const app: express.Application = appCreator.createExpressApp();

MiddlewaresConfig.config(app);

app.use("/api", apiRouter);

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    console.error("Error capturado:", err);
    
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";
    
    res.status(status).json(apiResponse(false, { message }));
});

export default app;
