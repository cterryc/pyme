"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const routes_1 = __importDefault(require("../api/auth/routes"));
const routes_2 = __importDefault(require("../api/user/routes"));
const routes_3 = __importDefault(require("../api/company/routes"));
const routes_4 = __importDefault(require("../api/document/routes"));
const routes_5 = __importDefault(require("../api/loan/routes"));
const routes_6 = __importDefault(require("../api/admin/routes"));
const controller_1 = require("../api/sse/controller");
const authenticate_sse_middleware_1 = __importDefault(require("../middlewares/authenticate.sse.middleware"));
const apiRouter = (0, express_1.Router)();
apiRouter.use("/auth", routes_1.default);
apiRouter.use("/user", routes_2.default);
apiRouter.use("/companies", routes_3.default);
apiRouter.use("/documents", routes_4.default);
apiRouter.use("/loanRequest", routes_5.default);
apiRouter.use("/admin", routes_6.default);
apiRouter.get("/events", authenticate_sse_middleware_1.default, controller_1.subscribeLoanStatus);
apiRouter.use("/" /* path */, (req, res) => {
    res.json({ message: "API is working!" });
    console.log("API is working!");
});
exports.default = apiRouter;
