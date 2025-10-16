import { Router } from "express";
import CompanyController from "./controller";
import schemaValidator from "../../middlewares/schemaValidators.middlewares";
import authenticate from "../../middlewares/authenticate.middleware";
import { validateUuid } from "../../middlewares/validateParamId.middleware";
import LoanController from "./controller";
import { createCreditApplicationSchema, loanRequestSchema } from "./validator";

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
    schemaValidator(createCreditApplicationSchema, null),
    LoanController.createCreditApplication
);

loanRouter.get(
    "/user",
    authenticate,
    LoanController.listCreditApplicationsByUserId
);

export default loanRouter;