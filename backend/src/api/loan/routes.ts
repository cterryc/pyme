import { Router } from "express";
import CompanyController from "./controller";
import schemaValidator from "../../middlewares/schemaValidators.middlewares";
import authenticate from "../../middlewares/authenticate.middleware";
import { validateUuid } from "../../middlewares/validateParamId.middleware";
import LoanController from "./controller";
import { loanRequestSchema } from "./validator";

const loanRouter = Router();


// Protected routes
loanRouter.post(
  "/",
  authenticate,
  schemaValidator(loanRequestSchema, null),
  LoanController.loanRequest
);


loanRouter.post(
    "/confirm",
    authenticate,
    LoanController.createCreditApplication
);

export default loanRouter;