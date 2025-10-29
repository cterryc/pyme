import { Router } from "express";
import schemaValidator from "../../middlewares/schemaValidators.middlewares";
import authenticate from "../../middlewares/authenticate.middleware";
import LoanController from "./controller";
import { 
  createCreditApplicationSchema, 
  loanRequestSchema,
  getCreditApplicationStatusParamsSchema,
  listCreditApplicationsQuerySchema,
  getCreditApplicationByIdParamsSchema,
  deleteCreditApplicationParamsSchema
} from "./validator";

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

loanRouter.get(
    "/status/:id",
    authenticate,
    schemaValidator(null, getCreditApplicationStatusParamsSchema),
    LoanController.getCreditApplicationStatus
);

loanRouter.get(
    "/",
    authenticate,
    schemaValidator(null, listCreditApplicationsQuerySchema),
    LoanController.listCreditApplications
);

loanRouter.get(
    "/:id",
    authenticate,
    // schemaValidator(null, getCreditApplicationByIdParamsSchema),
    LoanController.getCreditApplicationById
);

loanRouter.delete(
    "/:id",
    authenticate,
    schemaValidator(null, deleteCreditApplicationParamsSchema),
    LoanController.deleteCreditApplication
);

// loanRouter.post(
//     "/firma",
//     // schemaValidator(createCreditApplicationSchema, null),
//     LoanController.apiFirma
// );

// loanRouter.post(
//     "/firma",
//     // schemaValidator(createCreditApplicationSchema, null),
//     LoanController.apiFirma
// );

export default loanRouter;