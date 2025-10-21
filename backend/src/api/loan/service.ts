import { In, Repository } from "typeorm";
import { AppDataSource } from "../../config/data-source";
import HttpError from "../../utils/HttpError.utils";
import { HttpStatus } from "../../constants/HttpStatus";
import { CreditApplication } from "../../entities/CreditApplication.entity";
import { Company } from "../../entities/Company.entity";
import { RiskTierConfig } from "../../entities/Risk_tier_config.entity";
import { SystemConfig } from "../../entities/System_config.entity";
import { Industry } from "../../entities/Industry.entity";
import { CreditApplicationStatus } from "../../constants/CreditStatus";
import { RiskTier } from "../../constants/RiskTier";
import { Document } from "../../entities/Document.entity";
import {
  responseLoanRequest,
  LoanCalculationResult,
  responseLoanByUser,
  computeAgeYears,
  calculateCompanyRiskScore,
  getIndustryAdjustment,
  clamp,
  getTierFromScore,
  capsFor,
  interestRateFor,
} from "./interface";
import { generateUniqueCode } from "../../utils/generateCode.utils";
import { LoanResponseDto, responseLoanByUserListDto } from "./dto";
import { broadcastLoanStatusUpdate } from "../sse/controller";

export default class LoanService {
  private readonly loanRepo: Repository<CreditApplication>;
  private readonly companyRepo: Repository<Company>;
  private readonly riskTierConfigRepo: Repository<RiskTierConfig>;
  private readonly systemConfigRepo: Repository<SystemConfig>;
  private readonly industryRepo: Repository<Industry>;
  private readonly documentRepo: Repository<Document>;

  constructor() {
    this.loanRepo = AppDataSource.getRepository(CreditApplication);
    this.companyRepo = AppDataSource.getRepository(Company);
    this.riskTierConfigRepo = AppDataSource.getRepository(RiskTierConfig);
    this.systemConfigRepo = AppDataSource.getRepository(SystemConfig);
    this.industryRepo = AppDataSource.getRepository(Industry);
    this.documentRepo = AppDataSource.getRepository(Document);
  }

  async loanRequest(
    userId: string,
    companyId: string
  ): Promise<responseLoanRequest> {
    const company = await this.companyRepo.findOne({
      where: { id: companyId, owner: { id: userId } },
      relations: ["industry"],
    });

    if (!company) {
      throw new HttpError(HttpStatus.NOT_FOUND, "La compañía no existe");
    }

    const documentCount = await this.documentRepo.count({
      where: { company: { id: companyId } },
    });

    if (documentCount === 0) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        "La compañía no tiene documentos requeridos para la solicitud de crédito."
      );
    }

    const activeStatuses = [
      CreditApplicationStatus.APPLYING,
      CreditApplicationStatus.SUBMITTED,
      CreditApplicationStatus.DOCUMENTS_REQUIRED,
      CreditApplicationStatus.UNDER_REVIEW,
    ];

    const existingApplication = await this.loanRepo.findOne({
      where: { company: { id: company.id }, status: In(activeStatuses) },
    });

    if (existingApplication) {
      if (!existingApplication.offerDetails) {
        throw new HttpError(
          HttpStatus.BAD_REQUEST,
          "La solicitud existe pero no tiene oferta calculada."
        );
      }
      return LoanResponseDto.fromExisting(existingApplication, company);
    }

    const loanOptions = await this.calculateLoanOptions(company);

    const MAX_RETRIES = 3;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const code = await generateUniqueCode("CRD");

        const newLoanRequest = this.loanRepo.create({
          applicationNumber: code,
          company,
          offerDetails: loanOptions,
          status: CreditApplicationStatus.APPLYING,
          statusHistory: [
            {
              status: CreditApplicationStatus.APPLYING,
              timestamp: new Date(),
              changedBy: "system",
              reason: "Oferta generada automáticamente",
            },
          ],
        });

        broadcastLoanStatusUpdate(userId, {
          id: newLoanRequest.id,
          newStatus: newLoanRequest.status,
          updatedAt: newLoanRequest.updatedAt,
        });

        const savedApplication = await this.loanRepo.save(newLoanRequest);

        return LoanResponseDto.fromNew(savedApplication, company, loanOptions);
      } catch (error: any) {
        if (error.code === "23505" && attempt < MAX_RETRIES) {
          console.warn(
            `Intento ${attempt}: Colisión de applicationNumber. Reintentando...`
          );
        } else {
          console.error("Error al guardar la solicitud de crédito:", error);
          throw new HttpError(
            HttpStatus.SERVER_ERROR,
            "Error al crear la solicitud de crédito."
          );
        }
      }
    }
    throw new HttpError(
      HttpStatus.SERVER_ERROR,
      "No se pudo crear una solicitud de crédito única después de varios intentos."
    );
  }

  async createCreditApplication(
    applicationId: string,
    selectedAmount: number,
    selectedTermMonths: number,
    companyId: string,
    userId: string
  ): Promise<responseLoanRequest> {
    const application = await this.loanRepo.findOne({
      where: { id: applicationId, company: { id: companyId } },
      relations: ["company"],
    });

    if (!application) {
      throw new HttpError(
        HttpStatus.NOT_FOUND,
        "La solicitud de crédito no existe."
      );
    }

    const company = await this.companyRepo.findOne({
      where: { id: application.companyId, owner: { id: userId } },
    });

    if (!company) {
      throw new HttpError(
        HttpStatus.FORBIDDEN,
        "La solicitud de crédito no existe."
      );
    }

    if (application.status !== CreditApplicationStatus.APPLYING) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        "Esta solicitud ya fue confirmada."
      );
    }

    if (!application.offerDetails) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        "La solicitud no tiene una oferta calculada."
      );
    }

    // Validar montos y términos contra la oferta
    const { minAmount, maxAmount, allowedTerms } = application.offerDetails;

    if (selectedAmount < minAmount) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        `El monto mínimo permitido es ${minAmount}.`
      );
    }

    if (selectedAmount > maxAmount) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        `El monto máximo permitido es ${maxAmount}.`
      );
    }

    if (!allowedTerms.includes(selectedTermMonths)) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        `Plazo no permitido. Términos válidos: ${allowedTerms.join(", ")}.`
      );
    }

    // Actualizar la aplicación
    application.selectedAmount = selectedAmount;
    application.selectedTermMonths = selectedTermMonths;
    application.status = CreditApplicationStatus.SUBMITTED;
    application.submittedAt = new Date();

    // Actualizar historial
    application.statusHistory = [
      ...(application.statusHistory || []),
      {
        status: CreditApplicationStatus.SUBMITTED,
        timestamp: new Date(),
        changedBy: userId,
        reason: "Owner confirmó monto y plazo",
      },
    ];

    await this.loanRepo.save(application);

    broadcastLoanStatusUpdate(userId, {
      id: application.id,
      newStatus: application.status,
      updatedAt: application.updatedAt,
    });

    return LoanResponseDto.fromConfirmed(application, company);
  }

  async listCreditApplicationsByUserId(
    userId: string
  ): Promise<responseLoanByUser[]> {
    const applications = await this.loanRepo.find({
      where: { company: { owner: { id: userId } } },
      relations: ["company"],
      order: { createdAt: "DESC" },
    });

    return responseLoanByUserListDto(applications);
  }

  async getCreditApplicationStatus(applicationId: string): Promise<string> {
    // Lógica para obtener el estado de la solicitud de crédito
    return "PENDING";
  }

  async calculateLoanOptions(company: Company): Promise<LoanCalculationResult> {
    // 1. Cargar TODAS las configuraciones de la base de datos
    const [systemConfigs, riskTierConfigs] = await Promise.all([
      this.systemConfigRepo.find(),
      this.riskTierConfigRepo.find(),
    ]);

    // 2. Procesar configuraciones en Mapas para fácil acceso
    const configMap = new Map<string, number>();
    systemConfigs.forEach((config) => {
      configMap.set(config.key, config.value); 
    });

    const riskTierConfigMap = new Map<RiskTier, RiskTierConfig>();
    riskTierConfigs.forEach((config) => {
      riskTierConfigMap.set(config.tier, config);
    });

   
    const BASE_RATE = configMap.get("BASE_RATE") ?? 5.5;
    const ABSOLUTE_MIN_LOAN = configMap.get("ABSOLUTE_MIN_LOAN") ?? 1000;
    const ABSOLUTE_MAX_LOAN = configMap.get("ABSOLUTE_MAX_LOAN") ?? 5000000;
    const ROUND_TO = configMap.get("ROUND_TO") ?? 1000;

    // 3. Obtener datos de la compañía
    const revenue = Math.max(0, Number(company.annualRevenue ?? 0));
    const employeeCount = company.employeeCount ?? null;
    const ageYears = computeAgeYears(company.foundedDate);
    const revPerEmp =
      employeeCount && employeeCount > 0 ? revenue / employeeCount : null;

    // 4. Caso Borde: Compañía sin ingresos
    if (!revenue) {
      const tierDConfig = riskTierConfigMap.get(RiskTier.D);
      const defaultRate = BASE_RATE + Number(tierDConfig?.spread ?? 10.0);
      return {
        minAmount: ABSOLUTE_MIN_LOAN,
        maxAmount: 5000,
        interestRate: defaultRate,
        allowedTerms: [6, 12],
        calculationSnapshot: {
          baseRate: BASE_RATE,
          companyRiskTier: RiskTier.D,
          industryRiskTier: company.industry?.baseRiskTier ?? RiskTier.D,
          riskScore: 0,
          riskTierConfig: null,
          systemConfigs: { BASE_RATE },
          companyData: { revenue, employeeCount, ageYears, revPerEmp },
          calculatedAt: new Date(),
          note: "Sin revenue - valores por defecto",
        },
      };
    }

    // 5. Lógica de Scoring
    const companyMetrics = { revenue, ageYears, revPerEmp };
    const baseScore = calculateCompanyRiskScore(companyMetrics);
    const industryTier = company.industry?.baseRiskTier ?? RiskTier.C;
    const industryAdjustment = getIndustryAdjustment(industryTier);
    const finalScore = clamp(baseScore + industryAdjustment, 0, 100);
    const companyTier = getTierFromScore(finalScore); // Mapea 0-100 -> A, B, C, D

    // 6. Obtener la configuración para el Tier calculado
    const tierConfig = riskTierConfigMap.get(companyTier);
    if (!tierConfig) {
      throw new HttpError(
        HttpStatus.SERVER_ERROR,
        `Configuración para risk tier ${companyTier} no encontrada.`
      );
    }

    // 7. Calcular montos, plazos y tasa
    const { min, max } = capsFor(tierConfig, revenue, {
      ABSOLUTE_MIN_LOAN,
      ABSOLUTE_MAX_LOAN,
      ROUND_TO,
    });

    // Los plazos permitidos vienen directamente del seed
    const allowedTerms = tierConfig.allowed_terms;

    // La tasa usa el 'spread' del seed + el ajuste 'intra-tier'
    const interestRate = interestRateFor(BASE_RATE, tierConfig, finalScore);

    // 8. Retornar la oferta final
    return {
      minAmount: min,
      maxAmount: max,
      interestRate,
      allowedTerms,
      calculationSnapshot: {
        baseRate: BASE_RATE,
        companyRiskTier: companyTier,
        industryRiskTier: industryTier,
        riskScore: finalScore,
        riskTierConfig: {
          tier: tierConfig.tier,
          spread: Number(tierConfig.spread),
          factor: Number(tierConfig.factor),
        },
        systemConfigs: { BASE_RATE, ABSOLUTE_MIN_LOAN, ABSOLUTE_MAX_LOAN },
        companyData: { revenue, employeeCount, ageYears, revPerEmp },
        calculatedAt: new Date(),
      },
    };
  }
}
