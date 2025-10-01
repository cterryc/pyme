import 'reflect-metadata';
import express from "express";
import ExpressAppCreator from "./config/createApp";
import MiddlewaresConfig from "./config/middlewares.config";
import apiRouter from "./routers";



const appCreator = new ExpressAppCreator();
const app: express.Application = appCreator.createExpressApp();

MiddlewaresConfig.config(app);

app.use("/api", apiRouter);

export default app;
