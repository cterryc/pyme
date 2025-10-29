"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapIndustryToDto = exports.mapRiskTierConfigToDto = exports.mapSystemConfigToDto = void 0;
const mapSystemConfigToDto = (entity) => ({
    id: entity.id,
    key: entity.key,
    value: entity.value,
    description: entity.description,
});
exports.mapSystemConfigToDto = mapSystemConfigToDto;
const mapRiskTierConfigToDto = (entity) => ({
    id: entity.id,
    tier: entity.tier,
    spread: entity.spread,
    factor: entity.factor,
    allowed_terms: entity.allowed_terms,
});
exports.mapRiskTierConfigToDto = mapRiskTierConfigToDto;
const mapIndustryToDto = (entity) => ({
    id: entity.id,
    name: entity.name,
    baseRiskTier: entity.baseRiskTier,
    description: entity.description,
});
exports.mapIndustryToDto = mapIndustryToDto;
