// src/services/SeedService.ts
import { Repository, DataSource } from "typeorm";
import { Industry } from "../entities/Industry.entity";
import { RiskTierConfig } from "../entities/Risk_tier_config.entity";
import { SystemConfig } from "../entities/System_config.entity";
import { RiskTier } from "../constants/RiskTier";

export class SeedService {
  private industryRepo: Repository<Industry>;
  private riskTierConfigRepo: Repository<RiskTierConfig>;
  private systemConfigRepo: Repository<SystemConfig>;

  constructor(private dataSource: DataSource) {
    // Usar el dataSource que se pasa como parámetro
    this.industryRepo = this.dataSource.getRepository(Industry);
    this.riskTierConfigRepo = this.dataSource.getRepository(RiskTierConfig);
    this.systemConfigRepo = this.dataSource.getRepository(SystemConfig);
  }

  async initializeDatabase(): Promise<{ success: boolean; message: string }> {
    try {
      console.log("🔧 Inicializando datos de la base de datos...");

      // Verificar que las conexiones estén listas
      await this.verifyConnections();

      await this.seedIndustries();
      await this.seedRiskTierConfigs();
      await this.seedSystemConfigs();

      const status = await this.getDatabaseStatus();
      console.log("✅ Datos inicializados correctamente:", status);

      return { success: true, message: "Datos inicializados correctamente" };
    } catch (error) {
      console.error("❌ Error inicializando datos:", error);
      return { success: false, message: `Error: ${error}` };
    }
  }

  private async verifyConnections(): Promise<void> {
    // Verificar que los repositorios estén inicializados
    if (!this.industryRepo || !this.riskTierConfigRepo || !this.systemConfigRepo) {
      throw new Error("Repositorios no inicializados correctamente");
    }
  }

  // ... (el resto de los métodos seedIndustries, seedRiskTierConfigs, etc. se mantienen igual)
  private async seedIndustries(): Promise<void> {
    const industriesData = [
      { name: "software", baseRiskTier: RiskTier.A, description: "Desarrollo de software y tecnología" },
      { name: "servicios", baseRiskTier: RiskTier.B, description: "Servicios profesionales y consultoría" },
      { name: "comercio", baseRiskTier: RiskTier.C, description: "Comercio minorista" },
      { name: "hoteleria", baseRiskTier: RiskTier.C, description: "Hotelería y turismo" },
      { name: "construccion", baseRiskTier: RiskTier.C, description: "Construcción e ingeniería civil" },
      { name: "agricultura", baseRiskTier: RiskTier.B, description: "Agricultura y ganadería" },
      { name: "manufactura", baseRiskTier: RiskTier.B, description: "Manufactura y producción industrial" },
      { name: "salud", baseRiskTier: RiskTier.A, description: "Salud y servicios médicos" },
      { name: "educacion", baseRiskTier: RiskTier.A, description: "Educación y formación" },
      { name: "finanzas", baseRiskTier: RiskTier.A, description: "Servicios financieros y bancarios" },
      { name: "bienes_raices", baseRiskTier: RiskTier.B, description: "Bienes raíces y propiedades" },
      { name: "transporte", baseRiskTier: RiskTier.C, description: "Transporte y logística" },
      { name: "energia", baseRiskTier: RiskTier.B, description: "Energía y utilities" },
      { name: "entretenimiento", baseRiskTier: RiskTier.B, description: "Entretenimiento y medios" },
      { name: "alimentos y bebidas", baseRiskTier: RiskTier.C, description: "Alimentos y bebidas" }
    ];

    for (const industryData of industriesData) {
      try {
        const existing = await this.industryRepo.findOne({
          where: { name: industryData.name }
        });

        if (!existing) {
          const industry = this.industryRepo.create(industryData);
          await this.industryRepo.save(industry);
          console.log(`✅ Industria creada: ${industryData.name}`);
        }
      } catch (error) {
        console.error(`❌ Error creando industria ${industryData.name}:`, error);
      }
    }
  }

  private async seedRiskTierConfigs(): Promise<void> {
    const riskTierConfigs = [
      { tier: RiskTier.A, spread: 8.00, factor: 0.3500, allowed_terms: [12, 18, 24, 36] },
      { tier: RiskTier.B, spread: 12.00, factor: 0.2500, allowed_terms: [12, 18, 24, 36] },
      { tier: RiskTier.C, spread: 18.00, factor: 0.1500, allowed_terms: [12, 18, 24] },
      { tier: RiskTier.D, spread: 28.00, factor: 0.1000, allowed_terms: [6, 12] }
    ];

    for (const configData of riskTierConfigs) {
      try {
        const existing = await this.riskTierConfigRepo.findOne({
          where: { tier: configData.tier }
        });

        if (!existing) {
          const config = this.riskTierConfigRepo.create(configData);
          await this.riskTierConfigRepo.save(config);
          console.log(`✅ Risk Tier ${configData.tier} configurado`);
        }
      } catch (error) {
        console.error(`❌ Error creando risk tier ${configData.tier}:`, error);
      }
    }
  }

  private async seedSystemConfigs(): Promise<void> {
    const systemConfigs = [
      { key: "BASE_RATE", value: 20.0000, description: "Tasa de interés base anual (%)" },
      { key: "ABSOLUTE_MIN_LOAN", value: 1000.0000, description: "Monto mínimo absoluto de préstamo" },
      { key: "ABSOLUTE_MAX_LOAN", value: 500000.0000, description: "Monto máximo absoluto de préstamo" },
      { key: "ROUND_TO", value: 1000.0000, description: "Redondeo de montos de préstamo" }
    ];

    for (const configData of systemConfigs) {
      try {
        const existing = await this.systemConfigRepo.findOne({
          where: { key: configData.key }
        });

        if (!existing) {
          const config = this.systemConfigRepo.create(configData);
          await this.systemConfigRepo.save(config);
          console.log(`✅ Configuración ${configData.key} creada`);
        }
      } catch (error) {
        console.error(`❌ Error creando system config ${configData.key}:`, error);
      }
    }
  }

  async getDatabaseStatus(): Promise<{
    industries: number;
    riskTierConfigs: number;
    systemConfigs: number;
  }> {
    try {
      const [industries, riskTierConfigs, systemConfigs] = await Promise.all([
        this.industryRepo.count().catch(() => 0),
        this.riskTierConfigRepo.count().catch(() => 0),
        this.systemConfigRepo.count().catch(() => 0)
      ]);

      return { industries, riskTierConfigs, systemConfigs };
    } catch (error) {
      console.error("❌ Error obteniendo estado de la base de datos:", error);
      return { industries: 0, riskTierConfigs: 0, systemConfigs: 0 };
    }
  }

  async isDatabaseSeeded(): Promise<boolean> {
    try {
      const status = await this.getDatabaseStatus();
      return status.industries > 0 && status.riskTierConfigs > 0 && status.systemConfigs > 0;
    } catch (error) {
      return false;
    }
  }
}