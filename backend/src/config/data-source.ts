import "reflect-metadata";
import { DataSource } from "typeorm";
import config from "./enviroment.config";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: config.DB_HOST,
    port: config.DB_PORT,
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    ssl: config.DB_SSL ? { rejectUnauthorized: false } : false,
    synchronize: config.NODE_ENV === "development", // Auto-sync in dev only
    logging: config.NODE_ENV === "development",
    entities: ["src/entities/**/*.ts"],
    migrations: ["src/migrations/**/*.ts"],
    subscribers: ["src/subscribers/**/*.ts"],
});
