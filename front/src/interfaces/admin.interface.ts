// Interfaces para el módulo de administración

export interface SystemConfig {
  id: string;
  key: string;
  value: number;
  description?: string;
}

export interface RiskTierConfig {
  id: string;
  tier: 'A' | 'B' | 'C' | 'D';
  spread: number;
  factor: number;
  allowed_terms: number[];
}

export interface Industry {
  id: string;
  name: string;
  baseRiskTier: 'A' | 'B' | 'C' | 'D';
  description?: string;
}

// Interfaces para las respuestas de la API
export interface SystemConfigResponse {
  success: boolean;
  payload: SystemConfig[];
}

export interface RiskTierConfigResponse {
  success: boolean;
  payload: RiskTierConfig[];
}

export interface IndustryResponse {
  success: boolean;
  payload: Industry[];
}

export interface SingleSystemConfigResponse {
  success: boolean;
  payload: SystemConfig;
}

export interface SingleRiskTierConfigResponse {
  success: boolean;
  payload: RiskTierConfig;
}

export interface SingleIndustryResponse {
  success: boolean;
  payload: Industry;
}

export interface DeleteResponse {
  success: boolean;
  payload: { message: string };
}

// Interfaces para crear/actualizar
export interface CreateSystemConfigData {
  key: string;
  value: number;
  description?: string;
}

export interface UpdateSystemConfigData {
  key?: string;
  value?: number;
  description?: string;
}

export interface CreateRiskTierConfigData {
  tier: 'A' | 'B' | 'C' | 'D';
  spread: number;
  factor: number;
  allowed_terms: number[];
}

export interface UpdateRiskTierConfigData {
  tier?: 'A' | 'B' | 'C' | 'D';
  spread?: number;
  factor?: number;
  allowed_terms?: number[];
}

export interface CreateIndustryData {
  name: string;
  baseRiskTier: 'A' | 'B' | 'C' | 'D';
  description?: string;
}

export interface UpdateIndustryData {
  name?: string;
  baseRiskTier?: 'A' | 'B' | 'C' | 'D';
  description?: string;
}
