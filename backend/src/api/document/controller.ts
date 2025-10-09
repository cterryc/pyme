import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../constants/HttpStatus";
import apiResponse from "../../utils/apiResponse.utils";
import DocumentService from "./service";
import {
  IUploadDocumentPayload,
  IUpdateDocumentStatusPayload,
  IUploadedFile,
} from "./interfaces";

export default class DocumentController {
  private static documentService = new DocumentService();

  static uploadDocuments = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const files = req.files as IUploadedFile[];
      const userId = res.locals.user.id;

      const payload: IUploadDocumentPayload = {
        type: req.body.type,
        companyId: req.body.companyId,
        creditApplicationId: req.body.creditApplicationId,
      };

      const result = await DocumentController.documentService.uploadDocuments(
        files,
        payload,
        userId
      );

      res
        .status(HttpStatus.CREATED)
        .json(apiResponse(true, { documents: result }));
    } catch (err: any) {
      next(err);
    }
  };

  static getDocumentsByCompany = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { companyId } = req.params;

      const result =
        await DocumentController.documentService.getDocumentsByCompany(
          companyId
        );

      res.status(HttpStatus.OK).json(apiResponse(true, { documents: result }));
    } catch (err: any) {
      next(err);
    }
  };

  static deleteDocument = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const userId = res.locals.user.id;

      await DocumentController.documentService.deleteDocument(id, userId);

      res
        .status(HttpStatus.OK)
        .json(
          apiResponse(true, { message: "Documento eliminado exitosamente" })
        );
    } catch (err: any) {
      next(err);
    }
  };

  static getDocumentDownloadUrl = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;

      const result =
        await DocumentController.documentService.getDocumentDownloadUrl(id);

      res.status(HttpStatus.OK).json(apiResponse(true, result));
    } catch (err: any) {
      next(err);
    }
  };

  static updateDocumentStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const reviewerId = res.locals.user.id;

      const payload: IUpdateDocumentStatusPayload = {
        status: req.body.status,
        rejectionReason: req.body.rejectionReason,
      };

      const result =
        await DocumentController.documentService.updateDocumentStatus(
          id,
          payload,
          reviewerId
        );

      res.status(HttpStatus.OK).json(apiResponse(true, result));
    } catch (err: any) {
      next(err);
    }
  };
}
