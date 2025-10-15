import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../constants/HttpStatus";
import apiResponse from "../../utils/apiResponse.utils";
import CompanyService from "./service";
import { createCompanySchema, updateCompanySchema } from "./validator";

export default class CompanyController {
  private static companyService = new CompanyService();

  static createCompany = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = createCompanySchema.parse(req.body);
      const userId = res.locals.user?.id as string;

      const newCompany = await this.companyService.createCompany(dto, userId);
      res.status(HttpStatus.CREATED).json(apiResponse(true, newCompany));
    } catch (error) {
      return next(error);
    }
  };

  static getCompanyById = async ( req: Request, res: Response, next: NextFunction) => {
    try {
      const companyId = req.params.id;

      const userId = res.locals.user?.id as string;

      const company = await this.companyService.getCompanyById(
        companyId,
        userId
      );
      
      res.status(HttpStatus.OK).json(apiResponse(true, company));
    } catch (error) {
      return next(error);
    }
  };

  static updateCompany = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const companyId = req.params.id;

        const dto = updateCompanySchema.parse(req.body);

        const userId = res.locals.user?.id as string;
    
        const updatedCompany = await this.companyService.updateCompany(companyId, dto, userId);
        
        if (!updatedCompany) {
            return res.status(HttpStatus.NOT_FOUND).json(apiResponse(false, { message: "La compañía no existe." }));
        }

        res.status(HttpStatus.OK).json(apiResponse(true, updatedCompany));
      } catch (error) {
          return next(error);
      }
  };

  static deleteCompanyByUser = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const companyId = req.params.id;
        const userId = res.locals.user?.id as string;
        const deletedCompany = await this.companyService.deleteCompanyByUser(companyId, userId);
        if (!deletedCompany) {
            return res.status(HttpStatus.NOT_FOUND).json(apiResponse(false, { message: "La compañía no existe." }));
        }
        return res.status(HttpStatus.OK).json(apiResponse(true, { message: "Compañía eliminada con éxito." }));
      } catch (error) {
          return next(error);
      }
  };

  static listCompaniesByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = res.locals.user.id;
      const companies = await this.companyService.listCompaniesByUserId(userId);
      res.status(HttpStatus.OK).json(apiResponse(true, companies));
    } catch (error) {
      return next(error);
    }
  };

  static getIndustries = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const industries = await this.companyService.getIndustries();
      res.status(HttpStatus.OK).json(apiResponse(true, industries));
    } catch (error) {
      return next(error);
    }

  // static getCompanyDocuments = async (req: Request, res: Response, next: NextFunction) => {
  //     try {
  //         const companyId = parseInt(req.params.id, 10);
  //         if (!companyId) {
  //             return apiResponse(res, HttpStatus.BAD_REQUEST, { message: "Company ID is required" });
  //         }
  //         const documents = await this.companyService.getCompanyDocuments(companyId);
  //         if (!documents) {
  //             return apiResponse(res, HttpStatus.NOT_FOUND, { message: "Company not found" });
  //         }
  //         return apiResponse(res, HttpStatus.OK, documents);
  //     } catch (error) {
  //         return next(error);
  //     }
  // };

  // static deleteCompanyDocument = async (req: Request, res: Response, next: NextFunction) => {
  //     try {
  //         const companyId = parseInt(req.params.companyId, 10);
  //         const documentId = parseInt(req.params.documentId, 10);
  //         if (!companyId || !documentId) {
  //             return apiResponse(res, HttpStatus.BAD_REQUEST, { message: "Company ID and Document ID are required" });
  //         }
  //         const deletedDocument = await this.companyService.deleteCompanyDocument(companyId, documentId);
  //         if (!deletedDocument) {
  //             return apiResponse(res, HttpStatus.NOT_FOUND, { message: "Document not found" });
  //         }
  //         return apiResponse(res, HttpStatus.OK, { message: "Document deleted successfully" });
  //     } catch (error) {
  //         return next(error);
  //     }
  // };
  }
}
