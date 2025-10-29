"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("../../config/data-source");
const System_config_entity_1 = require("../../entities/System_config.entity");
const Risk_tier_config_entity_1 = require("../../entities/Risk_tier_config.entity");
const Industry_entity_1 = require("../../entities/Industry.entity");
const HttpError_utils_1 = __importDefault(require("../../utils/HttpError.utils"));
const HttpStatus_1 = require("../../constants/HttpStatus");
const dto_1 = require("./dto");
class AdminService {
    constructor() {
        this.systemConfigRepo = data_source_1.AppDataSource.getRepository(System_config_entity_1.SystemConfig);
        this.riskTierConfigRepo = data_source_1.AppDataSource.getRepository(Risk_tier_config_entity_1.RiskTierConfig);
        this.industryRepo = data_source_1.AppDataSource.getRepository(Industry_entity_1.Industry);
    }
    // SystemConfig CRUD
    async createSystemConfig(data) {
        const exists = await this.systemConfigRepo.findOne({ where: { key: data.key } });
        if (exists) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.BAD_REQUEST, "La clave ya existe.");
        }
        const entity = this.systemConfigRepo.create(data);
        const saved = await this.systemConfigRepo.save(entity);
        return (0, dto_1.mapSystemConfigToDto)(saved);
    }
    async listSystemConfigs() {
        const entities = await this.systemConfigRepo.find({ order: { createdAt: "DESC" } });
        return entities.map(entity => (0, dto_1.mapSystemConfigToDto)(entity));
    }
    async getSystemConfigById(id) {
        const entity = await this.systemConfigRepo.findOne({ where: { id } });
        if (!entity) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.NOT_FOUND, "Configuración no encontrada.");
        }
        return (0, dto_1.mapSystemConfigToDto)(entity);
    }
    async updateSystemConfig(id, data) {
        const entity = await this.systemConfigRepo.findOne({ where: { id } });
        if (!entity) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.NOT_FOUND, "Configuración no encontrada.");
        }
        if (data.key && data.key !== entity.key) {
            const duplicate = await this.systemConfigRepo.findOne({ where: { key: data.key } });
            if (duplicate) {
                throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.BAD_REQUEST, "La clave ya existe.");
            }
        }
        this.systemConfigRepo.merge(entity, data);
        const saved = await this.systemConfigRepo.save(entity);
        return (0, dto_1.mapSystemConfigToDto)(saved);
    }
    async deleteSystemConfig(id) {
        const entity = await this.systemConfigRepo.findOne({ where: { id } });
        if (!entity) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.NOT_FOUND, "Configuración no encontrada.");
        }
        await this.systemConfigRepo.remove(entity);
    }
    // RiskTierConfig CRUD
    async createRiskTierConfig(data) {
        const exists = await this.riskTierConfigRepo.findOne({ where: { tier: data.tier } });
        if (exists) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.BAD_REQUEST, "El tier ya existe.");
        }
        const entity = this.riskTierConfigRepo.create(data);
        const saved = await this.riskTierConfigRepo.save(entity);
        return (0, dto_1.mapRiskTierConfigToDto)(saved);
    }
    async listRiskTierConfigs() {
        const entities = await this.riskTierConfigRepo.find({ order: { tier: "ASC" } });
        return entities.map(entity => (0, dto_1.mapRiskTierConfigToDto)(entity));
    }
    async getRiskTierConfigById(id) {
        const entity = await this.riskTierConfigRepo.findOne({ where: { id } });
        if (!entity) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.NOT_FOUND, "Configuración de riesgo no encontrada.");
        }
        return (0, dto_1.mapRiskTierConfigToDto)(entity);
    }
    async updateRiskTierConfig(id, data) {
        const entity = await this.riskTierConfigRepo.findOne({ where: { id } });
        if (!entity) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.NOT_FOUND, "Configuración de riesgo no encontrada.");
        }
        if (data.tier && data.tier !== entity.tier) {
            const duplicate = await this.riskTierConfigRepo.findOne({ where: { tier: data.tier } });
            if (duplicate) {
                throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.BAD_REQUEST, "El tier ya existe.");
            }
        }
        this.riskTierConfigRepo.merge(entity, data);
        const saved = await this.riskTierConfigRepo.save(entity);
        return (0, dto_1.mapRiskTierConfigToDto)(saved);
    }
    async deleteRiskTierConfig(id) {
        const entity = await this.riskTierConfigRepo.findOne({ where: { id } });
        if (!entity) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.NOT_FOUND, "Configuración de riesgo no encontrada.");
        }
        await this.riskTierConfigRepo.remove(entity);
    }
    // Industry CRUD
    async createIndustry(data) {
        const exists = await this.industryRepo.findOne({ where: { name: data.name.toLowerCase() } });
        if (exists) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.BAD_REQUEST, "La industria ya existe.");
        }
        const entity = this.industryRepo.create(data);
        const saved = await this.industryRepo.save(entity);
        return (0, dto_1.mapIndustryToDto)(saved);
    }
    async listIndustries() {
        const entities = await this.industryRepo.find({ order: { name: "ASC" } });
        return entities.map(dto_1.mapIndustryToDto);
    }
    async getIndustryById(id) {
        const entity = await this.industryRepo.findOne({ where: { id } });
        if (!entity) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.NOT_FOUND, "Industria no encontrada.");
        }
        return (0, dto_1.mapIndustryToDto)(entity);
    }
    async updateIndustry(id, data) {
        const entity = await this.industryRepo.findOne({ where: { id } });
        if (!entity) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.NOT_FOUND, "Industria no encontrada.");
        }
        if (data.name && data.name.toLowerCase() !== entity.name) {
            const duplicate = await this.industryRepo.findOne({ where: { name: data.name.toLowerCase() } });
            if (duplicate) {
                throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.BAD_REQUEST, "La industria ya existe.");
            }
        }
        this.industryRepo.merge(entity, { ...data, name: data.name ? data.name.toLowerCase() : entity.name });
        const saved = await this.industryRepo.save(entity);
        return (0, dto_1.mapIndustryToDto)(saved);
    }
    async deleteIndustry(id) {
        const entity = await this.industryRepo.findOne({ where: { id } });
        if (!entity) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.NOT_FOUND, "Industria no encontrada.");
        }
        await this.industryRepo.remove(entity);
    }
}
exports.default = AdminService;
