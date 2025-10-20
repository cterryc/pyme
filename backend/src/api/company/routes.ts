import { Router } from "express";
import CompanyController from "./controller";
import schemaValidator from "../../middlewares/schemaValidators.middlewares";
import { createCompanySchema, updateCompanySchema } from "./validator";
import authenticate from "../../middlewares/authenticate.middleware";
import { validateUuid } from "../../middlewares/validateParamId.middleware";
import authorizeRoles from "../../middlewares/authorization.middleware";
import { UserRole } from "../../constants/Roles";

const companyRouter = Router();

companyRouter.get(
  "/all",
  authenticate,
  authorizeRoles([UserRole.ADMIN]),
  CompanyController.getAllCompanies
);

companyRouter.get(
  "/industries",
  authenticate,
  authorizeRoles([UserRole.ADMIN, UserRole.OWNER]),
  CompanyController.getIndustries
);

// Protected routes
companyRouter.post(
  "/",
  authenticate,
  authorizeRoles([UserRole.ADMIN, UserRole.OWNER]),
  schemaValidator(createCompanySchema, null),
  CompanyController.createCompany
);

companyRouter.get(
    "/",
    authenticate,
    authorizeRoles([UserRole.ADMIN, UserRole.OWNER]),
    CompanyController.listCompaniesByUserId
);


companyRouter.get(
  "/:id",
  validateUuid,
  authorizeRoles([UserRole.ADMIN, UserRole.OWNER]),
  authenticate,
  CompanyController.getCompanyById
);




companyRouter.patch(
  "/:id",
  validateUuid,
  authenticate,
  authorizeRoles([UserRole.ADMIN, UserRole.OWNER]),
  schemaValidator(updateCompanySchema, null),
  CompanyController.updateCompany
);

companyRouter.delete(
  "/:id",
  validateUuid,
  authenticate,
  authorizeRoles([UserRole.ADMIN, UserRole.OWNER]),
  CompanyController.deleteCompanyByUser
);

export default companyRouter;