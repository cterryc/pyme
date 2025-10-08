import { Router } from "express";
import CompanyController from "./controller";
import schemaValidator from "../../middlewares/schemaValidators.middlewares";
import { createCompanySchema, updateCompanySchema } from "./validator";
import authenticate from "../../middlewares/authenticate.middleware";
import { validateUuid } from "../../middlewares/validateParamId.middleware";

const companyRouter = Router();

// Protected routes
companyRouter.post(
  "/",
  authenticate,
  schemaValidator(createCompanySchema, null),
  CompanyController.createCompany
);

companyRouter.get(
    "/",
    authenticate,
    CompanyController.listCompaniesByUserId
);


companyRouter.get(
  "/:id",
  validateUuid,
  authenticate,
  CompanyController.getCompanyById
);


companyRouter.patch(
  "/:id",
  validateUuid,
  authenticate,
  schemaValidator(updateCompanySchema, null),
  CompanyController.updateCompany
);

companyRouter.delete(
  "/:id",
  validateUuid,
  authenticate,
  CompanyController.deleteCompanyByUser
);

export default companyRouter;