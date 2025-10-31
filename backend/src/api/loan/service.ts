import { In, Repository } from "typeorm";
import { AppDataSource } from "../../config/data-source";
import HttpError from "../../utils/HttpError.utils";
import { HttpStatus } from "../../constants/HttpStatus";
import { CreditApplication } from "../../entities/CreditApplication.entity";
import { Company } from "../../entities/Company.entity";
import { RiskTierConfig } from "../../entities/Risk_tier_config.entity";
import { SystemConfig } from "../../entities/System_config.entity";
import { Industry } from "../../entities/Industry.entity";
import { CreditApplicationStatus, ALLOWED_STATUS_TRANSITIONS } from "../../constants/CreditStatus";
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
  ApiFirmaBody,
  apiFirmaResponse,
} from "./interface";
import { generateUniqueCode } from "../../utils/generateCode.utils";
import { LoanResponseDto, responseLoanByUserListDto } from "./dto";
import { broadcastLoanStatusUpdate } from "../sse/controller";
import config from "../../config/enviroment.config";
import { Signature } from "../../entities/Signature.entity";
import { User } from "../../entities/User.entity";
import { htmlLoanStatusUpdate } from "../auth/helpers";

export default class LoanService {
  private readonly loanRepo: Repository<CreditApplication>;
  private readonly companyRepo: Repository<Company>;
  private readonly riskTierConfigRepo: Repository<RiskTierConfig>;
  private readonly systemConfigRepo: Repository<SystemConfig>;
  private readonly industryRepo: Repository<Industry>;
  private readonly documentRepo: Repository<Document>;
  private readonly signature: Repository<Signature>;
  private readonly userRepo: Repository<User>;

  constructor() {
    this.loanRepo = AppDataSource.getRepository(CreditApplication);
    this.companyRepo = AppDataSource.getRepository(Company);
    this.riskTierConfigRepo = AppDataSource.getRepository(RiskTierConfig);
    this.systemConfigRepo = AppDataSource.getRepository(SystemConfig);
    this.industryRepo = AppDataSource.getRepository(Industry);
    this.documentRepo = AppDataSource.getRepository(Document);
    this.signature = AppDataSource.getRepository(Signature);
    this.userRepo = AppDataSource.getRepository(User);
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

  async getCreditApplicationStatus(applicationId: string): Promise<{ status: string; applicationNumber: string; submittedAt?: Date }> {
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

    return {
      status: application.status,
      applicationNumber: application.applicationNumber,
      submittedAt: application.submittedAt,
    };
  }

  async listCreditApplications(
    page: number | string = 1,
    limit: number | string = 10,
    status?: string
  ): Promise<{
    applications: responseLoanByUser[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const pageNum = typeof page === 'string' ? parseInt(page, 10) : page;
    const limitNum = typeof limit === 'string' ? parseInt(limit, 10) : limit;
    const skip = (pageNum - 1) * limitNum;
    
    const whereCondition: any = {};
    if (status) {
      whereCondition.status = status;
    }

    const [applications, total] = await this.loanRepo.findAndCount({
      where: whereCondition,
      relations: ["company"],
      order: { createdAt: "DESC" },
      skip,
      take: limitNum,
    });

    const totalPages = Math.ceil(total / limitNum);

    return {
      applications: responseLoanByUserListDto(applications),
      total,
      page: pageNum,
      totalPages,
    };
  }

  async getCreditApplicationById(applicationId: string): Promise<responseLoanRequest> {
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

    if (!application.company) {
      throw new HttpError(
        HttpStatus.NOT_FOUND,
        "La compañía asociada no existe."
      );
    }

    return LoanResponseDto.fromExisting(application, application.company);
  }

  async deleteCreditApplication(applicationId: string, userId: string): Promise<{ message: string }> {
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

    // Verificar que el usuario sea el propietario de la compañía
    if (application.company.ownerId !== userId) {
      throw new HttpError(
        HttpStatus.FORBIDDEN,
        "No tienes permisos para eliminar esta solicitud."
      );
    }

    // Solo permitir eliminar solicitudes en estado APPLYING o SUBMITTED
    const allowedStatuses = [
      CreditApplicationStatus.APPLYING,
      CreditApplicationStatus.SUBMITTED,
    ];

    if (!allowedStatuses.includes(application.status as CreditApplicationStatus)) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        "No se puede eliminar una solicitud que ya está en proceso de revisión."
      );
    }

    await this.loanRepo.remove(application);

    return { message: "Solicitud de crédito eliminada exitosamente." };
  }

  // --- MÉTODOS ADMINISTRATIVOS ---

  async updateCreditApplicationStatus(
    applicationId: string,
    newStatus: CreditApplicationStatus,
    adminUserId: string,
    rejectionReason?: string,
    internalNotes?: string,
    userNotes?: string,
    approvedAmount?: number,
    riskScore?: number
  ): Promise<{ message: string; application: responseLoanRequest }> {
    const application = await this.loanRepo.findOne({
      where: { id: applicationId },
      relations: ["company"],
    });

    const adminUser = await this.userRepo.findOne({ where: { id: adminUserId } });

    if (!application) {
      throw new HttpError(
        HttpStatus.NOT_FOUND,
        "La solicitud de crédito no existe."
      );
    }

    // Validar transición de estado
    const validTransitions = this.getValidStatusTransitions(application.status);
    if (!validTransitions.includes(newStatus)) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        `No se puede cambiar de ${application.status} a ${newStatus}. Transiciones válidas: ${validTransitions.join(", ")}`
      );
    }

    // Validaciones específicas por estado
    if (newStatus === CreditApplicationStatus.REJECTED && !rejectionReason) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        "Se requiere una razón de rechazo para rechazar la solicitud."
      );
    }

    // if (newStatus === CreditApplicationStatus.APPROVED && !approvedAmount) {
    //   throw new HttpError(
    //     HttpStatus.BAD_REQUEST,
    //     "Se requiere especificar el monto aprobado para aprobar la solicitud."
    //   );
    // }

    // Actualizar campos según el nuevo estado
    const now = new Date();
    application.status = newStatus;
    application.reviewedById = adminUserId;
    application.reviewedAt = now;

    if (rejectionReason) {
      application.rejectionReason = rejectionReason;
    }

    if (internalNotes) {
      application.internalNotes = internalNotes;
    }

    if (userNotes) {
      application.userNotes = userNotes;
    }

    if (approvedAmount) {
      application.approvedAmount = approvedAmount;
    }

    if (riskScore !== undefined) {
      application.riskScore = riskScore;
    }

    if (newStatus === CreditApplicationStatus.APPROVED) {
      application.approvedAt = now;
    }

    if (newStatus === CreditApplicationStatus.DISBURSED) {
      application.disbursedAt = now;
    }

    // Actualizar historial de estados
    const statusHistoryEntry = {
      status: newStatus,
      timestamp: now,
      changedBy: adminUser?.email,
      reason: rejectionReason || userNotes || internalNotes || `Estado actualizado por administrador`,
    };

    application.statusHistory = [
      ...(application.statusHistory || []),
      statusHistoryEntry,
    ];


    if(newStatus === CreditApplicationStatus.APPROVED) {
      application.approvedAmount = application.selectedAmount;
    }

    
    if (newStatus === CreditApplicationStatus.APPROVED) {
      const docUrlGenerate = "https://puaqabdbobgomkjepvjc.supabase.co/storage/v1/object/public/contrato-pdf/contrato/Contrato_Prestamo_Pyme.pdf";
      
      const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer sw6AK-UfwtvQW9ep3i-IPYsWPSuiJG7y7TgaR3IWSlo'
        },
        body: JSON.stringify({
          "doc_hash": 'c83e66953f8b303697d4712ce0590e3eeaa2bbc7a0daa05001a01d764e908339',//"DOCUMENT_HASH"
          "doc_id": application.id,//id solicitud
          "doc_url": docUrlGenerate,
          "callback": `${config.BACKEND_URL}/api/loanRequest/firma`,
          "return_url": `${config.FRONTEND_URL}/panel/firma`,
          "description": "Términos y condiciones del contrato con Financia para la solicitud de préstamo",
          "external_ref" : application.id
        }) // Convert the data object to a JSON string
      };
      console.log(`callback enviado en petición de firma: ${config.BACKEND_URL}/api/loanRequest/firma`);
      const response = await fetch(config.BACKEND_FIRMA, options);
      const data= await response.json() as apiFirmaResponse;
      console.log("data ==>",data);
      
      if (!data.success) {
        throw new HttpError(
          HttpStatus.BAD_REQUEST,
          data.payload.error||'Error al crear la solicitud de firma'
        );
      }
      // const urlFirma = 'https://firma-digital-alpha.vercel.app/panel/firmar-documento?signId=IDFIRMA'
      application.requestId = data.payload.requestId;
      application.contractDocument = docUrlGenerate;
    }

    await this.loanRepo.save(application);

    // Notificar al usuario sobre el cambio de estado
    if (application.company.ownerId) {
      // Enviar notificación SSE en tiempo real
      broadcastLoanStatusUpdate(application.company.ownerId, {
        id: application.id,
        newStatus: application.status,
        updatedAt: application.updatedAt,
      });

      // Enviar email de notificación
      try {
        const user = await this.userRepo.findOne({
          where: { id: application.company.ownerId }
        });

        if (user?.email) {
          const amount = application.selectedAmount || application.approvedAmount || 0;
          const reasonText = rejectionReason || userNotes || undefined;
          
          await this.sendLoanStatusEmail(
            user.email,
            user.firstName || "Usuario",
            application.company.tradeName,
            application.applicationNumber,
            newStatus,
            amount,
            reasonText
          );
        }
      } catch (emailError) {
        console.error("Error al enviar email de notificación:", emailError);
        // No afectar el flujo principal si falla el email
      }
    }

    return {
      message: `Estado actualizado a ${newStatus}`,
      application: LoanResponseDto.fromExisting(application, application.company),
    };
  }

  async getCreditApplicationsForAdmin(
    page: number | string = 1,
    limit: number | string = 10,
    status?: CreditApplicationStatus | string,
    companyName?: string
  ): Promise<{
    applications: any[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const pageNum = typeof page === 'string' ? parseInt(page, 10) : page;
    const limitNum = typeof limit === 'string' ? parseInt(limit, 10) : limit;
    const skip = (pageNum - 1) * limitNum;
    
    const whereCondition: any = {};
    if (status) {
      whereCondition.status = status;
    }

    const queryBuilder = this.loanRepo
      .createQueryBuilder("application")
      .leftJoinAndSelect("application.company", "company")
      .leftJoinAndSelect("application.reviewedBy", "reviewedBy")
      .where(whereCondition);

    if (companyName) {
      queryBuilder.andWhere("company.legalName ILIKE :companyName", {
        companyName: `%${companyName}%`,
      });
    }

    const [applications, total] = await queryBuilder
      .orderBy("application.createdAt", "DESC")
      .skip(skip)
      .take(limitNum)
      .getManyAndCount();

    const totalPages = Math.ceil(total / limitNum);

    return {
      applications: applications.map(app => ({
        id: app.id,
        applicationNumber: app.applicationNumber,
        companyName: app.company?.legalName,
        selectedAmount: app.selectedAmount,
        approvedAmount: app.approvedAmount,
        status: app.status,
        submittedAt: app.submittedAt,
        reviewedAt: app.reviewedAt,
        approvedAt: app.approvedAt,
        rejectionReason: app.rejectionReason,
        internalNotes: app.internalNotes,
        riskScore: app.riskScore,
        company: app.company ? {
          annualRevenue: app.company.annualRevenue,
          employeeCount: app.company.employeeCount,
        } : null,
        reviewedBy: app.reviewedBy ? {
          id: app.reviewedBy.id,
          name: `${app.reviewedBy.firstName || ''} ${app.reviewedBy.lastName || ''}`.trim() || 'Usuario',
          email: app.reviewedBy.email,
        } : null,
      })),
      total,
      page: pageNum,
      totalPages,
    };
  }

  async getCreditApplicationByIdForAdmin(applicationId: string): Promise<any> {
    const application = await this.loanRepo.findOne({
      where: { id: applicationId },
      relations: ["company", "company.industry", "company.owner", "company.documents", "reviewedBy", "documents"],
    });

    if (!application) {
      throw new HttpError(
        HttpStatus.NOT_FOUND,
        "La solicitud de crédito no existe."
      );
    }

    // Combinar documentos de la solicitud y de la compañía
    const allDocuments = [
      ...(application.documents || []),
      ...(application.company?.documents || [])
    ];

    // Eliminar duplicados por ID
    const uniqueDocuments = Array.from(
      new Map(allDocuments.map(doc => [doc.id, doc])).values()
    );

    return {
      id: application.id,
      applicationNumber: application.applicationNumber,
      status: application.status,
      selectedAmount: application.selectedAmount,
      selectedTermMonths: application.selectedTermMonths,
      approvedAmount: application.approvedAmount,
      rejectionReason: application.rejectionReason,
      internalNotes: application.internalNotes,
      userNotes: application.userNotes,
      riskScore: application.offerDetails?.calculationSnapshot.riskTierConfig,
      submittedAt: application.submittedAt,
      reviewedAt: application.reviewedAt,
      approvedAt: application.approvedAt,
      disbursedAt: application.disbursedAt,
      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
      offerDetails: application.offerDetails,
      statusHistory: application.statusHistory || [],
      company: application.company ? {
        id: application.company.id,
        legalName: application.company.legalName,
        cuit: application.company.taxId,
        annualRevenue: application.company.annualRevenue,
        employeeCount: application.company.employeeCount,
        foundedDate: application.company.foundedDate,
        industry: application.company.industry ? {
          id: application.company.industry.id,
          name: application.company.industry.name,
        } : null,
        owner: application.company.owner ? {
          id: application.company.owner.id,
          firstName: application.company.owner.firstName,
          lastName: application.company.owner.lastName,
          email: application.company.owner.email,
        } : null,
      } : null,
      reviewedBy: application.reviewedBy ? {
        id: application.reviewedBy.id,
        name: `${application.reviewedBy.firstName || ''} ${application.reviewedBy.lastName || ''}`.trim() || 'Usuario',
        email: application.reviewedBy.email,
      } : null,
      documents: uniqueDocuments.map(doc => ({
        id: doc.id,
        name: doc.fileName,
        fileUrl: doc.fileUrl,
        uploadedAt: doc.createdAt,
        type: doc.type,
        status: doc.status,
      })),
    };
  }

  async getDashboardStats(): Promise<{
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    recentApplications: any[];
  }> {
    // Obtener todas las solicitudes
    const allApplications = await this.loanRepo.find({
      relations: ["company", "reviewedBy"],
      order: { createdAt: "DESC" },
    });

    // Calcular estadísticas
    const stats = {
      total: allApplications.length,
      approved: allApplications.filter(app => app.status === CreditApplicationStatus.APPROVED).length,
      pending: allApplications.filter(app => 
        app.status === CreditApplicationStatus.SUBMITTED || 
        app.status === CreditApplicationStatus.UNDER_REVIEW ||
        app.status === CreditApplicationStatus.DOCUMENTS_REQUIRED
      ).length,
      rejected: allApplications.filter(app => app.status === CreditApplicationStatus.REJECTED).length,
      recentApplications: allApplications.slice(0, 5).map(app => ({
        id: app.id,
        applicationNumber: app.applicationNumber,
        companyName: app.company?.legalName,
        selectedAmount: app.selectedAmount,
        approvedAmount: app.approvedAmount,
        status: app.status,
        submittedAt: app.submittedAt,
        createdAt: app.createdAt,
      })),
    };

    return stats;
  }

  private getValidStatusTransitions(currentStatus: CreditApplicationStatus): CreditApplicationStatus[] {
    // Usar las transiciones definidas centralmente en CreditStatus.ts
    return ALLOWED_STATUS_TRANSITIONS[currentStatus] || [];
  }

  /**
   * Envía un email al usuario notificando el cambio de estado del crédito
   */
  private async sendLoanStatusEmail(
    userEmail: string,
    userName: string,
    companyName: string,
    applicationNumber: string,
    newStatus: string,
    amount: number,
    statusReason?: string
  ): Promise<void> {
    try {
      const htmlContent = htmlLoanStatusUpdate(
        userName,
        companyName,
        applicationNumber,
        newStatus,
        amount,
        statusReason,
        config.FRONTEND_URL || 'http://localhost:5173'
      );

      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": config.BREVO_API_KEY,
        },
        body: JSON.stringify({
          sender: {
            name: "Pyme - Créditos",
            email: "nc.equipo21@gmail.com",
          },
          replyTo: {
            email: "nc.equipo21@gmail.com",
            name: "Pyme Soporte",
          },
          to: [
            {
              email: userEmail,
              name: userName,
            },
          ],
          subject: `Actualización: Tu crédito ${applicationNumber} - Estado: ${newStatus}`,
          htmlContent,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Error al enviar email de cambio de estado:", errorData);
        // No lanzamos error para que no afecte el flujo principal
      }
    } catch (error) {
      console.error("Error al enviar email de cambio de estado:", error);
      // No lanzamos error para que no afecte el flujo principal
    }
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

  async apiFirma (body: ApiFirmaBody) {
      await this.signature.save({
        signedDoc: body.signed_doc,
        docHash: body.doc_hash,
        publicKey:body.public_key,
        signerName:body.signer_name,
        signerSurname:body.signer_surname,
        creditApplicationId:body.external_ref
      });
      return 200;
  } 
}
