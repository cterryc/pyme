import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../constants/HttpStatus";
import apiResponse from "../../utils/apiResponse.utils";
import AdminLoanService from "./service";

export default class AdminLoanController {
  /**
   * GET /api/admin/loans
   * Lista todas las solicitudes de crédito con paginación y filtros
   */
  static listCreditApplications = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const service = new AdminLoanService();

      const params = {
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
        sortBy: (req.query.sortBy as any) || "createdAt",
        sortOrder: (req.query.sortOrder as "ASC" | "DESC") || "DESC",
        status: req.query.status as any,
        companyId: req.query.companyId as string,
        applicationNumber: req.query.applicationNumber as string,
        minAmount: req.query.minAmount ? Number(req.query.minAmount) : undefined,
        maxAmount: req.query.maxAmount ? Number(req.query.maxAmount) : undefined,
        search: req.query.search as string,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
      };

      const result = await service.listCreditApplications(params);

      res
        .status(HttpStatus.OK)
        .json(apiResponse(true, result));
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/admin/loans/:id
   * Obtiene el detalle completo de una solicitud de crédito
   */
  static getCreditApplicationDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const service = new AdminLoanService();

      const result = await service.getCreditApplicationDetails(id);

      res
        .status(HttpStatus.OK)
        .json(apiResponse(true, result));
    } catch (error) {
      next(error);
    }
  };

  /**
   * PATCH /api/admin/loans/:id/status
   * Actualiza el estado de una solicitud de crédito
   */
  static updateCreditApplicationStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const adminUserId = res.locals.user?.id;

      if (!adminUserId) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json(apiResponse(false, null));
      }

      const service = new AdminLoanService();

      const params = {
        status: req.body.status,
        reason: req.body.reason,
        internalNotes: req.body.internalNotes,
        approvedAmount: req.body.approvedAmount,
        riskScore: req.body.riskScore,
      };

      const result = await service.updateCreditApplicationStatus(
        id,
        adminUserId,
        params
      );

      res
        .status(HttpStatus.OK)
        .json(apiResponse(true, result));
    } catch (error) {
      next(error);
    }
  };
}
