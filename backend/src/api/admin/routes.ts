 import { Router } from "express";
 import AdminController from "./controller";
 import authenticate from "../../middlewares/authenticate.middleware";
 import authorizeRoles from "../../middlewares/authorization.middleware";
 import { UserRole } from "../../constants/Roles";
 import schemaValidator from "../../middlewares/schemaValidators.middlewares";
 import { validateUuid } from "../../middlewares/validateParamId.middleware";
import {
  createSystemConfigSchema,
  updateSystemConfigSchema,
  createRiskTierConfigSchema,
  updateRiskTierConfigSchema,
 createIndustrySchema,
 updateIndustrySchema,
 } from "./validator";
import { 
  updateCreditApplicationStatusBodySchema,
  getCreditApplicationsForAdminQuerySchema 
} from "../loan/validator";

 const adminRouter = Router();

 adminRouter.use(authenticate, authorizeRoles([UserRole.ADMIN, UserRole.OWNER]));

 adminRouter.get("/systemconfig", AdminController.listSystemConfigs);


 adminRouter.post(
   "/systemconfig",
   schemaValidator(createSystemConfigSchema, null),
   AdminController.createSystemConfig
 );

 adminRouter.get(
   "/systemconfig/:id",
   validateUuid,
   AdminController.getSystemConfigById
 );

 adminRouter.patch(
   "/systemconfig/:id",
   validateUuid,
   schemaValidator(updateSystemConfigSchema, null),
   AdminController.updateSystemConfig
 );

 adminRouter.delete(
   "/systemconfig/:id",
   validateUuid,
   AdminController.deleteSystemConfig
 );

 adminRouter.get("/risktier", AdminController.listRiskTierConfigs);

 adminRouter.post(
   "/risktier",
   schemaValidator(createRiskTierConfigSchema, null),
   AdminController.createRiskTierConfig
 );
 
 adminRouter.get(
   "/risktier/:id",
   validateUuid,
   AdminController.getRiskTierConfigById
 );

 adminRouter.patch(
   "/risktier/:id",
   validateUuid,
   schemaValidator(updateRiskTierConfigSchema, null),
   AdminController.updateRiskTierConfig
 );

 adminRouter.delete(
   "/risktier/:id",
   validateUuid,
   AdminController.deleteRiskTierConfig
 );

// INDUSTRIES
adminRouter.get("/industries", AdminController.listIndustries);

adminRouter.post(
  "/industries",
  schemaValidator(createIndustrySchema, null),
  AdminController.createIndustry
);

adminRouter.get(
  "/industries/:id",
  validateUuid,
  AdminController.getIndustryById
);

adminRouter.patch(
  "/industries/:id",
  validateUuid,
  schemaValidator(updateIndustrySchema, null),
  AdminController.updateIndustry
);

adminRouter.delete(
  "/industries/:id",
  validateUuid,
  AdminController.deleteIndustry
);

// CREDIT APPLICATIONS MANAGEMENT
adminRouter.get(
  "/dashboard/stats",
  AdminController.getDashboardStats
);
adminRouter.get(
  "/credit-applications", 
  schemaValidator(null, getCreditApplicationsForAdminQuerySchema),
  AdminController.getCreditApplicationsForAdmin
);
adminRouter.get(
  "/credit-applications/:id",
  validateUuid,
  AdminController.getCreditApplicationByIdForAdmin
);
adminRouter.patch(
  "/credit-applications/:id/status",
  validateUuid,
  schemaValidator(updateCreditApplicationStatusBodySchema, null),
  AdminController.updateCreditApplicationStatus
);

export default adminRouter;
