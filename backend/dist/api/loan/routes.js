"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const schemaValidators_middlewares_1 = __importDefault(require("../../middlewares/schemaValidators.middlewares"));
const authenticate_middleware_1 = __importDefault(require("../../middlewares/authenticate.middleware"));
const controller_1 = __importDefault(require("./controller"));
const validator_1 = require("./validator");
const validateParamId_middleware_1 = require("../../middlewares/validateParamId.middleware");
const loanRouter = (0, express_1.Router)();
loanRouter.use(authenticate_middleware_1.default);
// Protected routes
loanRouter.post("/", (0, schemaValidators_middlewares_1.default)(validator_1.loanRequestSchema, null), controller_1.default.loanRequest);
loanRouter.post("/confirm", (0, schemaValidators_middlewares_1.default)(validator_1.createCreditApplicationSchema, null), controller_1.default.createCreditApplication);
loanRouter.get("/user", controller_1.default.listCreditApplicationsByUserId);
loanRouter.get("/status/:id", validateParamId_middleware_1.validateUuid, (0, schemaValidators_middlewares_1.default)(null, validator_1.getCreditApplicationStatusParamsSchema), controller_1.default.getCreditApplicationStatus);
loanRouter.get("/", (0, schemaValidators_middlewares_1.default)(null, validator_1.listCreditApplicationsQuerySchema), controller_1.default.listCreditApplications);
loanRouter.get("/:id", validateParamId_middleware_1.validateUuid, (0, schemaValidators_middlewares_1.default)(null, validator_1.getCreditApplicationByIdParamsSchema), controller_1.default.getCreditApplicationById);
loanRouter.delete("/:id", validateParamId_middleware_1.validateUuid, (0, schemaValidators_middlewares_1.default)(null, validator_1.deleteCreditApplicationParamsSchema), controller_1.default.deleteCreditApplication);
loanRouter.post("/firma", 
// schemaValidator(createCreditApplicationSchema, null),
(req, res) => {
    console.log(req.body);
    res.status(200).json({ message: "Gracias" });
});
exports.default = loanRouter;
//# sourceMappingURL=routes.js.map