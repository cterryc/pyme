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
      // Lógica para obtener el estado de la solicitud de crédito
      res.status(HttpStatus.OK).json(apiResponse(true, { status: "PENDING" }));
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
      // Lógica para listar las solicitudes de crédito
      res.status(HttpStatus.OK).json(apiResponse(true, { applications: [] }));
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
      const applicationId = req.params.id;
      // Lógica para obtener una solicitud de crédito por ID
      res
        .status(HttpStatus.OK)
        .json(apiResponse(true, { application: { id: applicationId } }));
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
      const applicationId = req.params.id;
      // Lógica para eliminar una solicitud de crédito
      res
        .status(HttpStatus.OK)
        .json(apiResponse(true, { message: "Solicitud de crédito eliminada" }));
    } catch (error) {
      return next(error);
    }
  };
}
