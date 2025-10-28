"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedService = void 0;
const Industry_entity_1 = require("../entities/Industry.entity");
const Risk_tier_config_entity_1 = require("../entities/Risk_tier_config.entity");
const System_config_entity_1 = require("../entities/System_config.entity");
const RiskTier_1 = require("../constants/RiskTier");
class SeedService {
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.industryRepo = this.dataSource.getRepository(Industry_entity_1.Industry);
        this.riskTierConfigRepo = this.dataSource.getRepository(Risk_tier_config_entity_1.RiskTierConfig);
        this.systemConfigRepo = this.dataSource.getRepository(System_config_entity_1.SystemConfig);
    }
    async initializeDatabase() {
        try {
            console.log("🔧 Inicializando datos de la base de datos...");
            await this.verifyConnections();
            await this.seedIndustries();
            await this.seedRiskTierConfigs();
            await this.seedSystemConfigs();
            const status = await this.getDatabaseStatus();
            console.log("✅ Datos inicializados correctamente:", status);
            return { success: true, message: "Datos inicializados correctamente" };
        }
        catch (error) {
            console.error("❌ Error inicializando datos:", error);
            return { success: false, message: `Error: ${error}` };
        }
    }
    async verifyConnections() {
        if (!this.industryRepo ||
            !this.riskTierConfigRepo ||
            !this.systemConfigRepo) {
            throw new Error("Repositorios no inicializados correctamente");
        }
    }
    async seedIndustries() {
        const industriesData = [
            {
                name: "Software",
                baseRiskTier: RiskTier_1.RiskTier.A,
                description: "Desarrollo de software y tecnología",
            },
            {
                name: "Servicios",
                baseRiskTier: RiskTier_1.RiskTier.B,
                description: "Servicios profesionales y consultoría",
            },
            {
                name: "Comercio",
                baseRiskTier: RiskTier_1.RiskTier.C,
                description: "Comercio minorista",
            },
            {
                name: "Hotelería",
                baseRiskTier: RiskTier_1.RiskTier.C,
                description: "Hotelería y turismo",
            },
            {
                name: "Construcción",
                baseRiskTier: RiskTier_1.RiskTier.C,
                description: "Construcción e ingeniería civil",
            },
            {
                name: "Agricultura",
                baseRiskTier: RiskTier_1.RiskTier.B,
                description: "Agricultura y ganadería",
            },
            {
                name: "Manufactura",
                baseRiskTier: RiskTier_1.RiskTier.B,
                description: "Manufactura y producción industrial",
            },
            {
                name: "Salud",
                baseRiskTier: RiskTier_1.RiskTier.A,
                description: "Salud y servicios médicos",
            },
            {
                name: "Educación",
                baseRiskTier: RiskTier_1.RiskTier.A,
                description: "Educación y formación",
            },
            {
                name: "Finanzas",
                baseRiskTier: RiskTier_1.RiskTier.A,
                description: "Servicios financieros y bancarios",
            },
            {
                name: "Bienes Raíces",
                baseRiskTier: RiskTier_1.RiskTier.B,
                description: "Bienes raíces y propiedades",
            },
            {
                name: "Transporte",
                baseRiskTier: RiskTier_1.RiskTier.C,
                description: "Transporte y logística",
            },
            {
                name: "Energía",
                baseRiskTier: RiskTier_1.RiskTier.B,
                description: "Energía y utilities",
            },
            {
                name: "Entretenimiento",
                baseRiskTier: RiskTier_1.RiskTier.B,
                description: "Entretenimiento y medios",
            },
            {
                name: "Alimentos y Bebidas",
                baseRiskTier: RiskTier_1.RiskTier.C,
                description: "Alimentos y bebidas",
            },
        ];
        for (const industryData of industriesData) {
            try {
                const existing = await this.industryRepo.findOne({
                    where: { name: industryData.name },
                });
                if (!existing) {
                    const industry = this.industryRepo.create(industryData);
                    await this.industryRepo.save(industry);
                    console.log(`✅ Industria creada: ${industryData.name}`);
                }
            }
            catch (error) {
                console.error(`❌ Error creando industria ${industryData.name}:`, error);
            }
        }
    }
    async seedRiskTierConfigs() {
        const riskTierConfigs = [
            {
                tier: RiskTier_1.RiskTier.A,
                spread: 1.5,
                factor: 0.5,
                allowed_terms: [12, 18, 24, 36],
            },
            {
                tier: RiskTier_1.RiskTier.B,
                spread: 3.0,
                factor: 0.3,
                allowed_terms: [12, 18, 24, 36],
            },
            {
                tier: RiskTier_1.RiskTier.C,
                spread: 6.0,
                factor: 0.15,
                allowed_terms: [12, 18, 24],
            },
            { tier: RiskTier_1.RiskTier.D, spread: 10.0, factor: 0.1, allowed_terms: [6, 12] },
        ];
        for (const configData of riskTierConfigs) {
            try {
                const existing = await this.riskTierConfigRepo.findOne({
                    where: { tier: configData.tier },
                });
                if (!existing) {
                    const config = this.riskTierConfigRepo.create(configData);
                    await this.riskTierConfigRepo.save(config);
                    console.log(`✅ Risk Tier ${configData.tier} configurado`);
                }
            }
            catch (error) {
                console.error(`❌ Error creando risk tier ${configData.tier}:`, error);
            }
        }
    }
    async seedSystemConfigs() {
        const systemConfigs = [
            {
                key: "BASE_RATE",
                value: 3.5,
                description: "Tasa de interés base anual (USA Prime Rate)",
            },
            {
                key: "ABSOLUTE_MIN_LOAN",
                value: 1000.0,
                description: "Monto mínimo absoluto de préstamo",
            },
            {
                key: "ABSOLUTE_MAX_LOAN",
                value: 50000000.0,
                description: "Monto máximo absoluto de préstamo",
            },
            {
                key: "ROUND_TO",
                value: 1000.0,
                description: "Redondeo de montos de préstamo",
            },
            {
                key: "MAX_EMPLOYEE_COUNT",
                value: 250,
                description: "Número máximo de empleados",
            },
            {
                key: "MAX_ANNUAL_REVENUE",
                value: 50000000.0,
                description: "Ingreso anual máximo",
            },
        ];
        for (const configData of systemConfigs) {
            try {
                const existing = await this.systemConfigRepo.findOne({
                    where: { key: configData.key },
                });
                if (!existing) {
                    const config = this.systemConfigRepo.create(configData);
                    await this.systemConfigRepo.save(config);
                    console.log(`✅ Configuración ${configData.key} creada`);
                }
            }
            catch (error) {
                console.error(`❌ Error creando system config ${configData.key}:`, error);
            }
        }
    }
    async getDatabaseStatus() {
        try {
            const [industries, riskTierConfigs, systemConfigs] = await Promise.all([
                this.industryRepo.count().catch(() => 0),
                this.riskTierConfigRepo.count().catch(() => 0),
                this.systemConfigRepo.count().catch(() => 0),
            ]);
            return { industries, riskTierConfigs, systemConfigs };
        }
        catch (error) {
            console.error("❌ Error obteniendo estado de la base de datos:", error);
            return { industries: 0, riskTierConfigs: 0, systemConfigs: 0 };
        }
    }
    async isDatabaseSeeded() {
        try {
            const status = await this.getDatabaseStatus();
            return (status.industries > 0 &&
                status.riskTierConfigs > 0 &&
                status.systemConfigs > 0);
        }
        catch (error) {
            console.error("Database check failed:", error);
            return false;
        }
    }
}
exports.SeedService = SeedService;
//# sourceMappingURL=seed.utils.js.map