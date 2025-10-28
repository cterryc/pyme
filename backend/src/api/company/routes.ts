import { Router } from "express";
import CompanyController from "./controller";
import schemaValidator from "../../middlewares/schemaValidators.middlewares";
import { createCompanySchema, updateCompanySchema } from "./validator";
import authenticate from "../../middlewares/authenticate.middleware";
import { validateUuid } from "../../middlewares/validateParamId.middleware";
import authorizeRoles from "../../middlewares/authorization.middleware";
import { UserRole } from "../../constants/Roles";

const companyRouter = Router();

companyRouter.use(authenticate);

companyRouter.get(
  "/all",
  authorizeRoles([UserRole.ADMIN]),
  CompanyController.getAllCompanies
);

companyRouter.get(
  "/industries",
  CompanyController.getIndustries
);

// Protected routes
companyRouter.post(
  "/",
  schemaValidator(createCompanySchema, null),
  CompanyController.createCompany
);

companyRouter.get(
    "/",
    CompanyController.listCompaniesByUserId
);

companyRouter.get(
  "/:id",
  validateUuid,
  CompanyController.getCompanyById
);

companyRouter.patch(
  "/:id",
  validateUuid,
  schemaValidator(updateCompanySchema, null),
  CompanyController.updateCompany
);

companyRouter.delete(
  "/:id",
  validateUuid,
  CompanyController.deleteCompanyByUser
);

export default companyRouter;