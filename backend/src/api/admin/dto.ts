import { RiskTier } from "../../constants/RiskTier";

/**
 * DTO para SystemConfig - Solo devuelve campos esenciales
 */
export interface SystemConfigDto {
  id: string;
  key: string;
  value: number;
  description?: string;
}

/**
 * DTO para RiskTierConfig - Solo devuelve campos esenciales
 */
export interface RiskTierConfigDto {
  id: string;
  tier: RiskTier;
  spread: number;
  factor: number;
  allowed_terms: number[];
}

/**
 * DTO para respuesta de eliminación
 */
export interface DeleteResponseDto {
  message: string;
}

// Mappers centralizados para convertir entidades a DTOs
import { SystemConfig } from "../../entities/System_config.entity";
import { RiskTierConfig } from "../../entities/Risk_tier_config.entity";
import { Industry } from "../../entities/Industry.entity";

export const mapSystemConfigToDto = (entity: SystemConfig): SystemConfigDto => ({
  id: entity.id,
  key: entity.key,
  value: entity.value,
  description: entity.description,
});

export const mapRiskTierConfigToDto = (entity: RiskTierConfig): RiskTierConfigDto => ({
  id: entity.id,
  tier: entity.tier,
  spread: entity.spread,
  factor: entity.factor,
  allowed_terms: entity.allowed_terms,
});

// Industry DTO
export interface IndustryDto {
  id: string;
  name: string;
  baseRiskTier: RiskTier;
  description?: string;
}

export const mapIndustryToDto = (entity: Industry): IndustryDto => ({
  id: entity.id,
  name: entity.name,
  baseRiskTier: entity.baseRiskTier,
  description: entity.description,
});
