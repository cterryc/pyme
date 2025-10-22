 import { Request, Response, NextFunction } from "express";
 import { HttpStatus } from "../../constants/HttpStatus";
 import apiResponse from "../../utils/apiResponse.utils";
 import AdminService from "./service";
 import {
   createSystemConfigSchema,
   updateSystemConfigSchema,
   createRiskTierConfigSchema,
   updateRiskTierConfigSchema,
  createIndustrySchema,
  updateIndustrySchema,
 } from "./validator";

 export default class AdminController {
   private static service = new AdminService();

   static listSystemConfigs = async (
     req: Request,
     res: Response,
     next: NextFunction
   ) => {
     try {
       const result = await this.service.listSystemConfigs();
       res.status(HttpStatus.OK).json(apiResponse(true, result));
     } catch (error) {
       return next(error);
     }
   };

   static createSystemConfig = async (
     req: Request,
     res: Response,
     next: NextFunction
   ) => {
     try {
       const dto = createSystemConfigSchema.parse(req.body);
       const created = await this.service.createSystemConfig(dto);
       res.status(HttpStatus.CREATED).json(apiResponse(true, created));
     } catch (error) {
       return next(error);
     }
   };

   static getSystemConfigById = async (
     req: Request,
     res: Response,
     next: NextFunction
   ) => {
     try {
       const { id } = req.params;
       const entity = await this.service.getSystemConfigById(id);
       res.status(HttpStatus.OK).json(apiResponse(true, entity));
     } catch (error) {
       return next(error);
     }
   };

   static updateSystemConfig = async (
     req: Request,
     res: Response,
     next: NextFunction
   ) => {
     try {
       const { id } = req.params;
       const dto = updateSystemConfigSchema.parse(req.body);
       const updated = await this.service.updateSystemConfig(id, dto);
       res.status(HttpStatus.OK).json(apiResponse(true, updated));
     } catch (error) {
       return next(error);
     }
   };

   static deleteSystemConfig = async (
     req: Request,
     res: Response,
     next: NextFunction
   ) => {
     try {
       const { id } = req.params;
       await this.service.deleteSystemConfig(id);
       res.status(HttpStatus.OK).json(apiResponse(true, { message: "Eliminado" }));
     } catch (error) {
       return next(error);
     }
   };

   static listRiskTierConfigs = async (
     req: Request,
     res: Response,
     next: NextFunction
   ) => {
     try {
       const result = await this.service.listRiskTierConfigs();
       res.status(HttpStatus.OK).json(apiResponse(true, result));
     } catch (error) {
       return next(error);
     }
   };

   static createRiskTierConfig = async (
     req: Request,
     res: Response,
     next: NextFunction
   ) => {
     try {
       const dto = createRiskTierConfigSchema.parse(req.body);
       const created = await this.service.createRiskTierConfig(dto);
       res.status(HttpStatus.CREATED).json(apiResponse(true, created));
     } catch (error) {
       return next(error);
     }
   };

   static getRiskTierConfigById = async (
     req: Request,
     res: Response,
     next: NextFunction
   ) => {
     try {
       const { id } = req.params;
       const entity = await this.service.getRiskTierConfigById(id);
       res.status(HttpStatus.OK).json(apiResponse(true, entity));
     } catch (error) {
       return next(error);
     }
   };

   static updateRiskTierConfig = async (
     req: Request,
     res: Response,
     next: NextFunction
   ) => {
     try {
       const { id } = req.params;
       const dto = updateRiskTierConfigSchema.parse(req.body);
       const updated = await this.service.updateRiskTierConfig(id, dto);
       res.status(HttpStatus.OK).json(apiResponse(true, updated));
     } catch (error) {
       return next(error);
     }
   };

   static deleteRiskTierConfig = async (
     req: Request,
     res: Response,
     next: NextFunction
   ) => {
     try {
       const { id } = req.params;
       await this.service.deleteRiskTierConfig(id);
       res.status(HttpStatus.OK).json(apiResponse(true, { message: "Eliminado" }));
     } catch (error) {
       return next(error);
     }
   };

  // INDUSTRIES
  static listIndustries = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.service.listIndustries();
      res.status(HttpStatus.OK).json(apiResponse(true, result));
    } catch (error) {
      return next(error);
    }
  };

  static createIndustry = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto = createIndustrySchema.parse(req.body);
      const created = await this.service.createIndustry(dto);
      res.status(HttpStatus.CREATED).json(apiResponse(true, created));
    } catch (error) {
      return next(error);
    }
  };

  static getIndustryById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const entity = await this.service.getIndustryById(id);
      res.status(HttpStatus.OK).json(apiResponse(true, entity));
    } catch (error) {
      return next(error);
    }
  };

  static updateIndustry = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const dto = updateIndustrySchema.parse(req.body);
      const updated = await this.service.updateIndustry(id, dto);
      res.status(HttpStatus.OK).json(apiResponse(true, updated));
    } catch (error) {
      return next(error);
    }
  };

  static deleteIndustry = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      await this.service.deleteIndustry(id);
      res.status(HttpStatus.OK).json(apiResponse(true, { message: "Eliminado" }));
    } catch (error) {
      return next(error);
    }
  };
 }
