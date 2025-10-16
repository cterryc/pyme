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
import { responseLoanRequest, LoanCalculationResult } from "./interface";
import { generateUniqueCode } from "../../utils/generateCode.utils";

export default class LoanService {
  private readonly loanRepo: Repository<CreditApplication>;
  private readonly companyRepo: Repository<Company>;
  private readonly riskTierConfigRepo: Repository<RiskTierConfig>;
  private readonly systemConfigRepo: Repository<SystemConfig>;
  private readonly industryRepo: Repository<Industry>;

  constructor() {
    this.loanRepo = AppDataSource.getRepository(CreditApplication);
    this.companyRepo = AppDataSource.getRepository(Company);
    this.riskTierConfigRepo = AppDataSource.getRepository(RiskTierConfig);
    this.systemConfigRepo = AppDataSource.getRepository(SystemConfig);
    this.industryRepo = AppDataSource.getRepository(Industry);
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

    const activeStatuses = [
      CreditApplicationStatus.APPLYING,
      CreditApplicationStatus.SUBMITTED,
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

      return {
        id: existingApplication.id,

        applicationNumber: existingApplication.applicationNumber,

        legalName: company.legalName,

        annualRevenue: company.annualRevenue,

        offerDetails: {
          minAmount: existingApplication.offerDetails.minAmount,

          maxAmount: existingApplication.offerDetails.maxAmount,

          interestRate: existingApplication.offerDetails.interestRate,

          allowedTerms: existingApplication.offerDetails.allowedTerms,
        },

        selectedDetails: {
          amount: existingApplication.selectedAmount,

          termMonths: existingApplication.selectedTermMonths,
        },
      };
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

        const savedApplication = await this.loanRepo.save(newLoanRequest);

        return {
          id: savedApplication.id,
          applicationNumber: savedApplication.applicationNumber,
          legalName: company.legalName,
          annualRevenue: company.annualRevenue,
          offerDetails: loanOptions,
        };
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

  async calculateLoanOptions(company: Company): Promise<LoanCalculationResult> {
    const [baseRateConfig, riskTierConfigs] = await Promise.all([
      this.systemConfigRepo.findOne({ where: { key: "BASE_RATE" } }),
      this.riskTierConfigRepo.find(),
    ]);

    if (!baseRateConfig) {
      throw new HttpError(
        HttpStatus.SERVER_ERROR,
        "Configuración BASE_RATE no encontrada."
      );
    }

    const riskTierConfigMap = new Map<RiskTier, RiskTierConfig>();
    riskTierConfigs.forEach((config) => {
      riskTierConfigMap.set(config.tier, config);
    });

    const BASE_RATE = Number(baseRateConfig.value);
    const revenue = Math.max(0, Number(company.annualRevenue ?? 0));
    const employeeCount = company.employeeCount ?? null;
    const ageYears = this.computeAgeYears(company.foundedDate);
    const revPerEmp =
      employeeCount && employeeCount > 0 ? revenue / employeeCount : null;

    if (!revenue) {
      return {
        minAmount: 1000,
        maxAmount: 5000,
        interestRate: 10,
        allowedTerms: [12],
        calculationSnapshot: {
          baseRate: BASE_RATE,
          companyRiskTier: RiskTier.D,
          industryRiskTier: RiskTier.D,
          riskTierConfig: null,
          systemConfigs: { BASE_RATE },
          calculatedAt: new Date(),
          note: "Sin revenue - valores por defecto",
        },
      };
    }
    // 2. Determinar risk tier
    const industryTier = company.industry?.baseRiskTier ?? RiskTier.B;
    const companyTier = this.adjustTier(industryTier, ageYears, revPerEmp);

    const tierConfig = riskTierConfigMap.get(companyTier);
    if (!tierConfig) {
      throw new HttpError(
        HttpStatus.SERVER_ERROR,
        `Configuración para risk tier ${companyTier} no encontrada.`
      );
    }

    // 3. Calcular montos y términos
    const { min, max } = this.capsFor(tierConfig, revenue);
    const allowedTerms = this.allowedTermsFor(
      tierConfig,
      ageYears,
      revenue > 0
    );
    const interestRate = this.interestRateFor(
      BASE_RATE,
      tierConfig,
      ageYears,
      revPerEmp
    );

    return {
      minAmount: min,
      maxAmount: max,
      interestRate,
      allowedTerms,
      // calculationSnapshot: {
      //   baseRate: BASE_RATE,
      //   companyRiskTier: companyTier,
      //   industryRiskTier: industryTier,
      //   riskTierConfig: {
      //     tier: tierConfig.tier,
      //     spread: Number(tierConfig.spread),
      //     factor: Number(tierConfig.factor),
      //   },
      //   systemConfigs: { BASE_RATE },
      //   companyData: {
      //     revenue,
      //     employeeCount,
      //     ageYears,
      //     revPerEmp,
      //   },
      //   calculatedAt: new Date(),
    };
  }

  async createCreditApplication(
    applicationId: string,
    selectedAmount: number,
    selectedTermMonths: number,
    userId: string
  ): Promise<responseLoanRequest> {
    const application = await this.loanRepo.findOne({
      where: { id: applicationId },
      relations: ["company"],
    });

    if (!application) {
      throw new HttpError(
        HttpStatus.NOT_FOUND,
        "La solicitud de crédito no existe."
      );
    }

    // Verificar que la compañía pertenece al usuario
    const company = await this.companyRepo.findOne({
      where: { id: application.companyId, owner: { id: userId } },
    });

    if (!company) {
      throw new HttpError(
        HttpStatus.FORBIDDEN,
        "No tienes permisos para esta solicitud."
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

    return {
      id: application.id,
      applicationNumber: application.applicationNumber,
      legalName: company.legalName,
      annualRevenue: company.annualRevenue,
      offerDetails: application.offerDetails,
      selectedDetails: {
        amount: selectedAmount,
        termMonths: selectedTermMonths,
      },
    };
  }

  // --- MÉTODOS DE CÁLCULO (adaptados para usar BD) ---
  private computeAgeYears(foundedDate: any): number | null {
    if (!foundedDate) return null;

    try {
      // Intentar convertir a Date sin importar el tipo
      const date = new Date(foundedDate);

      if (isNaN(date.getTime())) {
        console.warn("Fecha inválida:", foundedDate);
        return null;
      }

      const diffMs = Date.now() - date.getTime();
      if (!isFinite(diffMs) || diffMs < 0) return 0;
      return Math.floor(diffMs / (365.25 * 24 * 3600 * 1000));
    } catch (error) {
      console.error("Error calculando edad desde fecha:", foundedDate, error);
      return null;
    }
  }

  private adjustTier(
    tier: RiskTier,
    ageYears: number | null,
    revPerEmp: number | null
  ): RiskTier {
    let t = tier;

    if (ageYears != null) {
      if (ageYears >= 5) t = this.bumpBetter(t);
      else if (ageYears < 1) t = this.bumpWorse(t);
    }

    if (revPerEmp != null) {
      if (revPerEmp >= 1_000_000) t = this.bumpBetter(t);
      else if (revPerEmp < 200_000) t = this.bumpWorse(t);
    }

    return t;
  }

  private bumpBetter(t: RiskTier): RiskTier {
    return t === "D"
      ? RiskTier.C
      : t === "C"
      ? RiskTier.B
      : t === "B"
      ? RiskTier.A
      : RiskTier.A;
  }

  private bumpWorse(t: RiskTier): RiskTier {
    return t === "A"
      ? RiskTier.A
      : t === "B"
      ? RiskTier.C
      : t === "C"
      ? RiskTier.D
      : RiskTier.D;
  }

  private allowedTermsFor(
    tierConfig: RiskTierConfig,
    ageYears: number | null,
    hasRevenue: boolean
  ): number[] {
    if (!hasRevenue) return [6, 12];
    return tierConfig.allowed_terms;
  }

  private interestRateFor(
    BASE_RATE: number,
    tierConfig: RiskTierConfig,
    ageYears: number | null,
    revPerEmp: number | null
  ): number {
    let rate = BASE_RATE + Number(tierConfig.spread);

    if (ageYears != null && ageYears >= 5) rate -= 1;
    if (revPerEmp != null && revPerEmp >= 1_000_000) rate -= 1;

    return this.clamp(Number(rate.toFixed(2)), 8, 80);
  }

  private capsFor(
    tierConfig: RiskTierConfig,
    revenue: number
  ): { min: number; max: number } {
    const ABSOLUTE_MIN_LOAN = 1_000;
    const ABSOLUTE_MAX_LOAN = 5_000_000;
    const ROUND_TO = 1_000;

    const factor = Number(tierConfig.factor);
    const rawMax = revenue * factor;
    const max = this.clamp(
      this.roundTo(rawMax, ROUND_TO),
      ABSOLUTE_MIN_LOAN,
      ABSOLUTE_MAX_LOAN
    );
    const rawMin = revenue * 0.05;
    const min = this.clamp(this.roundTo(rawMin, ROUND_TO), ROUND_TO, max);

    return { min, max };
  }

  private clamp(v: number, lo: number, hi: number): number {
    return Math.max(lo, Math.min(hi, v));
  }

  private roundTo(v: number, step: number): number {
    return Math.round(v / step) * step;
  }

  async getCreditApplicationStatus(applicationId: string): Promise<string> {
    // Lógica para obtener el estado de la solicitud de crédito
    return "PENDING";
  }
}
