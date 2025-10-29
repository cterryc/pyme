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
import { validateUuid } from "../../middlewares/validateParamId.middleware";

const loanRouter = Router();

loanRouter.use(authenticate);

// Protected routes
loanRouter.post(
  "/",
  schemaValidator(loanRequestSchema, null),
  LoanController.loanRequest
);


loanRouter.post(
    "/confirm",
    schemaValidator(createCreditApplicationSchema, null),
    LoanController.createCreditApplication
);

loanRouter.get(
    "/user",
    LoanController.listCreditApplicationsByUserId
);

loanRouter.get(
    "/status/:id",
    validateUuid,
    schemaValidator(null, getCreditApplicationStatusParamsSchema),
    LoanController.getCreditApplicationStatus
);

loanRouter.get(
    "/",
    schemaValidator(null, listCreditApplicationsQuerySchema),
    LoanController.listCreditApplications
);

loanRouter.get(
    "/:id",
    authenticate,
    // schemaValidator(null, getCreditApplicationByIdParamsSchema),
    validateUuid,
    schemaValidator(null, getCreditApplicationByIdParamsSchema),

    authenticate,
    // schemaValidator(null, getCreditApplicationByIdParamsSchema),
    // validateUuid,
    // schemaValidator(null, getCreditApplicationByIdParamsSchema),
    LoanController.getCreditApplicationById
);

loanRouter.delete(
    "/:id",
    validateUuid,
    schemaValidator(null, deleteCreditApplicationParamsSchema),
    LoanController.deleteCreditApplication
);

loanRouter.post(
    "/firma",
    // schemaValidator(createCreditApplicationSchema, null),
    LoanController.apiFirma
);

export default loanRouter;