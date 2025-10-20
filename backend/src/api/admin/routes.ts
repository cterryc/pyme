import authenticate from "../../middlewares/authenticate.middleware";
import authorizeRoles from "../../middlewares/authorization.middleware";
import schemaValidator from "../../middlewares/schemaValidators.middlewares";
import { getCreditApplicationDetailsSchema, listCreditApplicationsAdminSchema, updateCreditApplicationStatusSchema } from "./validator";
import { UserRole } from "../../constants/Roles";
import AdminLoanController from "./controller";
import { Router } from "express";
import { validateUuid } from "../../middlewares/validateParamId.middleware";
import authenticateSSE from "../../middlewares/authenticate.sse.middleware";

const adminRouter = Router();

/**
 * GET /api/loanRequest/admin/applications
 * Lista todas las solicitudes de crédito con paginación y filtros
 * Query params: page, limit, sortBy, sortOrder, status, companyId, applicationNumber, minAmount, maxAmount, search, startDate, endDate
 */
adminRouter.get(
  "/applications",
  authenticate,
  authorizeRoles([UserRole.ADMIN]),
  schemaValidator(listCreditApplicationsAdminSchema, null),
  AdminLoanController.listCreditApplications
);

/**
 * GET /api/loanRequest/admin/applications/:id
 * Obtiene el detalle completo de una solicitud de crédito con documentos
 */
adminRouter.get(
  "/applications/:id",
  authenticate,
  authorizeRoles([UserRole.ADMIN]),
  AdminLoanController.getCreditApplicationDetails
);

/**
 * PATCH /api/loanRequest/admin/applications/:id/status
 * Actualiza el estado de una solicitud de crédito
 * Body: { status, reason?, internalNotes?, approvedAmount?, riskScore? }
 */
adminRouter.patch(
  "/applications/:id/status",
  authenticate,
  authorizeRoles([UserRole.ADMIN]),
  AdminLoanController.updateCreditApplicationStatus
);


export default adminRouter;