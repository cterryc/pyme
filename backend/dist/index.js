"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const createApp_1 = __importDefault(require("./config/createApp"));
const middlewares_config_1 = __importDefault(require("./config/middlewares.config"));
const routers_1 = __importDefault(require("./routers"));
const apiResponse_utils_1 = __importDefault(require("./utils/apiResponse.utils"));
const controller_1 = require("./api/sse/controller");
const authenticate_sse_middleware_1 = __importDefault(require("./middlewares/authenticate.sse.middleware"));
(async () => {
    try {
        const appCreator = new createApp_1.default();
        const app = await appCreator.createExpressApp();
        middlewares_config_1.default.config(app);
        app.options("/api/events", controller_1.handleSSEPreflight);
        app.get("/api/events", authenticate_sse_middleware_1.default, controller_1.subscribeLoanStatus);
        app.use("/api", routers_1.default);
        // Middleware para manejar errores de JSON mal formado
        app.use((err, req, res, next) => {
            // Error de JSON mal formado
            if (err instanceof SyntaxError && 'body' in err && err.type === 'entity.parse.failed') {
                return res.status(400).json((0, apiResponse_utils_1.default)(false, {
                    message: "JSON mal formado. Por favor verifica la sintaxis del JSON enviado.",
                    details: err.message,
                    code: 400
                }));
            }
            next(err);
        });
        // Middleware para manejar otros errores
        app.use((err, req, res, _next) => {
            console.error("Error capturado:", err);
            const status = err.status || 500;
            const message = err.message || "Internal Server Error";
            res.status(status).json((0, apiResponse_utils_1.default)(false, { message, code: status }));
        });
    }
    catch (error) {
        console.error("❌ Error al iniciar la aplicación:", error);
        process.exit(1);
    }
})();
//# sourceMappingURL=index.js.map