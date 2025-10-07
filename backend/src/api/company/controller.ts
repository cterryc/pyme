import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../constants/HttpStatus";
import apiResponse from "../../utils/apiResponse.utils";
import CompanyService from "./service";
import { createCompanySchema } from "./validator";

export default class CompanyController {
  private static companyService = new CompanyService();

    static createCompany = async (req: Request, res: Response, next: NextFunction) => {
        try {
           const dto  = createCompanySchema.parse(req.body);
           const userId = res.locals.user?.id as string;   

            const newCompany = await this.companyService.createCompany(dto , userId);
            res.status(HttpStatus.CREATED).json(apiResponse(true, newCompany));
        } catch (error) {
            return next(error);
        }
    };


    // static getCompanyById = async (req: Request, res: Response, next: NextFunction) => {
    //     try {
    //         const companyId = parseInt(req.params.id, 10);
    //         const company = await this.companyService.getCompanyById(companyId);
    //         if (!company) {
    //             return apiResponse(res, HttpStatus.NOT_FOUND, { message: "Company not found" });
    //         }
    //         return apiResponse(res, HttpStatus.OK, company);
    //     } catch (error) {
    //         return next(error);
    //     }
    // };

    // static updateCompany = async (req: Request, res: Response, next: NextFunction) => {
    //     try {
    //         const companyId = req.params.id;
    //         if (!companyId) {
    //             return apiResponse(res, HttpStatus.BAD_REQUEST, { message: "Company ID is required" });
    //         }
    //         const companyData = req.body;
    //         const updatedCompany = await this.companyService.updateCompany(companyId, companyData);
    //         if (!updatedCompany) {
    //             return apiResponse(res, HttpStatus.NOT_FOUND, { message: "Company not found" });
    //         }
    //         return apiResponse(res, HttpStatus.OK, updatedCompany);
    //     } catch (error) {
    //         return next(error);
    //     }       
    // };

    // static deleteCompany = async (req: Request, res: Response, next: NextFunction) => {
    //     try {
    //         const companyId = parseInt(req.params.id, 10);
    //         if (!companyId) {
    //             return apiResponse(res, HttpStatus.BAD_REQUEST, { message: "Company ID is required" });
    //         }
    //         const deletedCompany = await this.companyService.deleteCompany(companyId);
    //         if (!deletedCompany) {
    //             return apiResponse(res, HttpStatus.NOT_FOUND, { message: "Company not found" });
    //         }
    //         return apiResponse(res, HttpStatus.OK, { message: "Company deleted successfully" });
    //     } catch (error) {
    //         return next(error);
    //     }
    // };  

    static listCompanies = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = res.locals.user.id;
            const companies = await this.companyService.listCompanies(userId);
            res.status(HttpStatus.OK).json(apiResponse(true, companies));
        } catch (error) {
            return next(error);
        }
    };  

    // static uploadCompanyDocument = async (req: Request, res: Response, next: NextFunction) => {
    //     try {
    //         const companyId = parseInt(req.params.id, 10);  
    //         if (!companyId) {
    //             return apiResponse(res, HttpStatus.BAD_REQUEST, { message: "Company ID is required" });
    //         }
    //         const document = req.file;
    //         if (!document) {
    //             return apiResponse(res, HttpStatus.BAD_REQUEST, { message: "Document is required" });
    //         }
    //         const uploadedDocument = await this.companyService.uploadCompanyDocument(companyId, document);
    //         if (!uploadedDocument) {
    //             return apiResponse(res, HttpStatus.NOT_FOUND, { message: "Company not found" });
    //         }
    //         return apiResponse(res, HttpStatus.OK, uploadedDocument);
    //     } catch (error) {
    //         return next(error);
    //     }
    // };

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
