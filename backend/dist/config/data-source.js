"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const enviroment_config_1 = __importDefault(require("./enviroment.config"));
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: enviroment_config_1.default.DB_HOST,
    port: enviroment_config_1.default.DB_PORT,
    username: enviroment_config_1.default.DB_USERNAME,
    password: enviroment_config_1.default.DB_PASSWORD,
    database: enviroment_config_1.default.DB_NAME,
    ssl: enviroment_config_1.default.DB_SSL ? { rejectUnauthorized: false } : false,
    synchronize: true, // Auto-sync in dev only
    logging: false,
    entities: ["src/entities/**/*.ts"],
    migrations: ["src/migrations/**/*.ts"],
    subscribers: ["src/subscribers/**/*.ts"],
    //   dropSchema: true,
});
//# sourceMappingURL=data-source.js.map