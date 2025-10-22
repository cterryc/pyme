import { Repository } from "typeorm";
import { AppDataSource } from "../../config/data-source";
import { SystemConfig } from "../../entities/System_config.entity";
import { RiskTierConfig } from "../../entities/Risk_tier_config.entity";
import { Industry } from "../../entities/Industry.entity";
import HttpError from "../../utils/HttpError.utils";
import { HttpStatus } from "../../constants/HttpStatus";
import {
  CreateSystemConfigInput,
  UpdateSystemConfigInput,
  CreateRiskTierConfigInput,
  UpdateRiskTierConfigInput,
  CreateIndustryInput,
  UpdateIndustryInput,
} from "./validator";
import { SystemConfigDto, RiskTierConfigDto, mapSystemConfigToDto, mapRiskTierConfigToDto, IndustryDto, mapIndustryToDto } from "./dto";

 export default class AdminService {
   private readonly systemConfigRepo: Repository<SystemConfig>;
   private readonly riskTierConfigRepo: Repository<RiskTierConfig>;
  private readonly industryRepo: Repository<Industry>;

  constructor() {
    this.systemConfigRepo = AppDataSource.getRepository(SystemConfig);
    this.riskTierConfigRepo = AppDataSource.getRepository(RiskTierConfig);
    this.industryRepo = AppDataSource.getRepository(Industry);
  }

  // Mappers movidos a dto.ts

  // SystemConfig CRUD
  async createSystemConfig(data: CreateSystemConfigInput): Promise<SystemConfigDto> {
    const exists = await this.systemConfigRepo.findOne({ where: { key: data.key } });
    if (exists) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "La clave ya existe.");
    }
    const entity: SystemConfig = this.systemConfigRepo.create(data as Partial<SystemConfig>) as SystemConfig;
    const saved = await this.systemConfigRepo.save(entity);
    return mapSystemConfigToDto(saved);
  }

  async listSystemConfigs(): Promise<SystemConfigDto[]> {
    const entities = await this.systemConfigRepo.find({ order: { createdAt: "DESC" } });
    return entities.map(entity => mapSystemConfigToDto(entity));
  }

  async getSystemConfigById(id: string): Promise<SystemConfigDto> {
    const entity = await this.systemConfigRepo.findOne({ where: { id } });
    if (!entity) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Configuración no encontrada.");
    }
    return mapSystemConfigToDto(entity);
  }

  async updateSystemConfig(
    id: string,
    data: UpdateSystemConfigInput
  ): Promise<SystemConfigDto> {
    const entity = await this.systemConfigRepo.findOne({ where: { id } });
    if (!entity) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Configuración no encontrada.");
    }
    if (data.key && data.key !== entity.key) {
      const duplicate = await this.systemConfigRepo.findOne({ where: { key: data.key } });
      if (duplicate) {
        throw new HttpError(HttpStatus.BAD_REQUEST, "La clave ya existe.");
      }
    }
    this.systemConfigRepo.merge(entity, data as any);
    const saved = await this.systemConfigRepo.save(entity);
    return mapSystemConfigToDto(saved);
  }

   async deleteSystemConfig(id: string): Promise<void> {
     const entity = await this.systemConfigRepo.findOne({ where: { id } });
     if (!entity) {
       throw new HttpError(HttpStatus.NOT_FOUND, "Configuración no encontrada.");
     }
     await this.systemConfigRepo.remove(entity);
   }

  // RiskTierConfig CRUD
  async createRiskTierConfig(data: CreateRiskTierConfigInput): Promise<RiskTierConfigDto> {
    const exists = await this.riskTierConfigRepo.findOne({ where: { tier: data.tier } });
    if (exists) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "El tier ya existe.");
    }
    const entity: RiskTierConfig = this.riskTierConfigRepo.create(data as Partial<RiskTierConfig>) as RiskTierConfig;
    const saved = await this.riskTierConfigRepo.save(entity);
    return mapRiskTierConfigToDto(saved);
  }

  async listRiskTierConfigs(): Promise<RiskTierConfigDto[]> {
    const entities = await this.riskTierConfigRepo.find({ order: { tier: "ASC" } });
    return entities.map(entity => mapRiskTierConfigToDto(entity));
  }

  async getRiskTierConfigById(id: string): Promise<RiskTierConfigDto> {
    const entity = await this.riskTierConfigRepo.findOne({ where: { id } });
    if (!entity) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Configuración de riesgo no encontrada.");
    }
    return mapRiskTierConfigToDto(entity);
  }

  async updateRiskTierConfig(
    id: string,
    data: UpdateRiskTierConfigInput
  ): Promise<RiskTierConfigDto> {
    const entity = await this.riskTierConfigRepo.findOne({ where: { id } });
    if (!entity) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Configuración de riesgo no encontrada.");
    }
    if (data.tier && data.tier !== entity.tier) {
      const duplicate = await this.riskTierConfigRepo.findOne({ where: { tier: data.tier } });
      if (duplicate) {
        throw new HttpError(HttpStatus.BAD_REQUEST, "El tier ya existe.");
      }
    }
    this.riskTierConfigRepo.merge(entity, data as any);
    const saved = await this.riskTierConfigRepo.save(entity);
    return mapRiskTierConfigToDto(saved);
  }

   async deleteRiskTierConfig(id: string): Promise<void> {
     const entity = await this.riskTierConfigRepo.findOne({ where: { id } });
     if (!entity) {
       throw new HttpError(HttpStatus.NOT_FOUND, "Configuración de riesgo no encontrada.");
     }
     await this.riskTierConfigRepo.remove(entity);
   }

  // Industry CRUD
  async createIndustry(data: CreateIndustryInput): Promise<IndustryDto> {
    const exists = await this.industryRepo.findOne({ where: { name: data.name.toLowerCase() } });
    if (exists) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "La industria ya existe.");
    }
    const entity = this.industryRepo.create(data as Partial<Industry>) as Industry;
    const saved = await this.industryRepo.save(entity);
    return mapIndustryToDto(saved);
  }

  async listIndustries(): Promise<IndustryDto[]> {
    const entities = await this.industryRepo.find({ order: { name: "ASC" } });
    return entities.map(mapIndustryToDto);
  }

  async getIndustryById(id: string): Promise<IndustryDto> {
    const entity = await this.industryRepo.findOne({ where: { id } });
    if (!entity) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Industria no encontrada.");
    }
    return mapIndustryToDto(entity);
  }

  async updateIndustry(id: string, data: UpdateIndustryInput): Promise<IndustryDto> {
    const entity = await this.industryRepo.findOne({ where: { id } });
    if (!entity) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Industria no encontrada.");
    }
    if (data.name && data.name.toLowerCase() !== entity.name) {
      const duplicate = await this.industryRepo.findOne({ where: { name: data.name.toLowerCase() } });
      if (duplicate) {
        throw new HttpError(HttpStatus.BAD_REQUEST, "La industria ya existe.");
      }
    }
    this.industryRepo.merge(entity, { ...data, name: data.name ? data.name.toLowerCase() : entity.name } as any);
    const saved = await this.industryRepo.save(entity);
    return mapIndustryToDto(saved);
  }

  async deleteIndustry(id: string): Promise<void> {
    const entity = await this.industryRepo.findOne({ where: { id } });
    if (!entity) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Industria no encontrada.");
    }
    await this.industryRepo.remove(entity);
  }
 }
