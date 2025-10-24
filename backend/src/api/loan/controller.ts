import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../constants/HttpStatus";
import apiResponse from "../../utils/apiResponse.utils";
import LoanService from "./service";
import { createCreditApplicationSchema, loanRequestSchema } from "./validator";
import { responseLoanRequest } from "./interface";

export default class LoanController {
  private static loanService = new LoanService();

  static loanRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = res.locals.user?.id as string;
      const companyId = loanRequestSchema.parse(req.body).companyId;

      const formLoanRequest = await this.loanService.loanRequest(
        userId,
        companyId
      );

      res.status(HttpStatus.OK).json(apiResponse(true, formLoanRequest));
    } catch (error) {
      return next(error);
    }
  };

  static createCreditApplication = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = res.locals.user?.id as string;
      const loanData = createCreditApplicationSchema.parse(req.body);

      const loanRequest: responseLoanRequest | null =
        await this.loanService.createCreditApplication(
          loanData.id,
          loanData.selectedAmount,
          loanData.selectedTermMonths,
          loanData.companyId,
          userId
        );

      res.status(HttpStatus.CREATED).json(apiResponse(true, loanRequest));
    } catch (error) {
      return next(error);
    }
  };

  static listCreditApplicationsByUserId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = res.locals.user?.id as string;
      const applications =
        await this.loanService.listCreditApplicationsByUserId(userId);
      res.status(HttpStatus.OK).json(apiResponse(true, applications));
    } catch (error) {
      return next(error);
    }
  };

  static getCreditApplicationStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const statusInfo = await this.loanService.getCreditApplicationStatus(id);
      res.status(HttpStatus.OK).json(apiResponse(true, statusInfo));
    } catch (error) {
      return next(error);
    }
  };

  static listCreditApplications = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { page, limit, status } = req.query;
      const result = await this.loanService.listCreditApplications(
        page as string | number, 
        limit as string | number, 
        status as string
      );
      res.status(HttpStatus.OK).json(apiResponse(true, result));
    } catch (error) {
      return next(error);
    }
  };

  static getCreditApplicationById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const application = await this.loanService.getCreditApplicationById(id);
      res.status(HttpStatus.OK).json(apiResponse(true, application));
    } catch (error) {
      return next(error);
    }
  };

  static deleteCreditApplication = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const userId = res.locals.user?.id as string;
      const result = await this.loanService.deleteCreditApplication(id, userId);
      res.status(HttpStatus.OK).json(apiResponse(true, result));
    } catch (error) {
      return next(error);
    }
  };

  // --- MÉTODOS ADMINISTRATIVOS ---

  static updateCreditApplicationStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const applicationId = req.params.id;
      const adminUserId = res.locals.user?.id as string;
      const {
        newStatus,
        rejectionReason,
        internalNotes,
        approvedAmount,
        riskScore,
      } = req.body;

      const result = await this.loanService.updateCreditApplicationStatus(
        applicationId,
        newStatus,
        adminUserId,
        rejectionReason,
        internalNotes,
        approvedAmount,
        riskScore
      );

      res.status(HttpStatus.OK).json(apiResponse(true, result));
    } catch (error) {
      return next(error);
    }
  };

  static getCreditApplicationsForAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string;
      const companyName = req.query.companyName as string;

      const result = await this.loanService.getCreditApplicationsForAdmin(
        page,
        limit,
        status as any,
        companyName
      );

      res.status(HttpStatus.OK).json(apiResponse(true, result));
    } catch (error) {
      return next(error);
    }
  };
}
