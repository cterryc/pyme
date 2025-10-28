"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const data_source_1 = require("../../config/data-source");
const HttpError_utils_1 = __importDefault(require("../../utils/HttpError.utils"));
const HttpStatus_1 = require("../../constants/HttpStatus");
const CreditApplication_entity_1 = require("../../entities/CreditApplication.entity");
const Company_entity_1 = require("../../entities/Company.entity");
const Risk_tier_config_entity_1 = require("../../entities/Risk_tier_config.entity");
const System_config_entity_1 = require("../../entities/System_config.entity");
const Industry_entity_1 = require("../../entities/Industry.entity");
const CreditStatus_1 = require("../../constants/CreditStatus");
const RiskTier_1 = require("../../constants/RiskTier");
const Document_entity_1 = require("../../entities/Document.entity");
const interface_1 = require("./interface");
const generateCode_utils_1 = require("../../utils/generateCode.utils");
const dto_1 = require("./dto");
const controller_1 = require("../sse/controller");
const enviroment_config_1 = __importDefault(require("../../config/enviroment.config"));
class LoanService {
    constructor() {
        this.loanRepo = data_source_1.AppDataSource.getRepository(CreditApplication_entity_1.CreditApplication);
        this.companyRepo = data_source_1.AppDataSource.getRepository(Company_entity_1.Company);
        this.riskTierConfigRepo = data_source_1.AppDataSource.getRepository(Risk_tier_config_entity_1.RiskTierConfig);
        this.systemConfigRepo = data_source_1.AppDataSource.getRepository(System_config_entity_1.SystemConfig);
        this.industryRepo = data_source_1.AppDataSource.getRepository(Industry_entity_1.Industry);
        this.documentRepo = data_source_1.AppDataSource.getRepository(Document_entity_1.Document);
    }
    async loanRequest(userId, companyId) {
        const company = await this.companyRepo.findOne({
            where: { id: companyId, owner: { id: userId } },
            relations: ["industry"],
        });
        if (!company) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.NOT_FOUND, "La compañía no existe");
        }
        const documentCount = await this.documentRepo.count({
            where: { company: { id: companyId } },
        });
        if (documentCount === 0) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.BAD_REQUEST, "La compañía no tiene documentos requeridos para la solicitud de crédito.");
        }
        const activeStatuses = [
            CreditStatus_1.CreditApplicationStatus.APPLYING,
            CreditStatus_1.CreditApplicationStatus.SUBMITTED,
            CreditStatus_1.CreditApplicationStatus.DOCUMENTS_REQUIRED,
            CreditStatus_1.CreditApplicationStatus.UNDER_REVIEW,
        ];
        const existingApplication = await this.loanRepo.findOne({
            where: { company: { id: company.id }, status: (0, typeorm_1.In)(activeStatuses) },
        });
        if (existingApplication) {
            if (!existingApplication.offerDetails) {
                throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.BAD_REQUEST, "La solicitud existe pero no tiene oferta calculada.");
            }
            return dto_1.LoanResponseDto.fromExisting(existingApplication, company);
        }
        const loanOptions = await this.calculateLoanOptions(company);
        const MAX_RETRIES = 3;
        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                const code = await (0, generateCode_utils_1.generateUniqueCode)("CRD");
                const newLoanRequest = this.loanRepo.create({
                    applicationNumber: code,
                    company,
                    offerDetails: loanOptions,
                    status: CreditStatus_1.CreditApplicationStatus.APPLYING,
                    statusHistory: [
                        {
                            status: CreditStatus_1.CreditApplicationStatus.APPLYING,
                            timestamp: new Date(),
                            changedBy: "system",
                            reason: "Oferta generada automáticamente",
                        },
                    ],
                });
                (0, controller_1.broadcastLoanStatusUpdate)(userId, {
                    id: newLoanRequest.id,
                    newStatus: newLoanRequest.status,
                    updatedAt: newLoanRequest.updatedAt,
                });
                const savedApplication = await this.loanRepo.save(newLoanRequest);
                return dto_1.LoanResponseDto.fromNew(savedApplication, company, loanOptions);
            }
            catch (error) {
                if (error.code === "23505" && attempt < MAX_RETRIES) {
                    console.warn(`Intento ${attempt}: Colisión de applicationNumber. Reintentando...`);
                }
                else {
                    console.error("Error al guardar la solicitud de crédito:", error);
                    throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.SERVER_ERROR, "Error al crear la solicitud de crédito.");
                }
            }
        }
        throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.SERVER_ERROR, "No se pudo crear una solicitud de crédito única después de varios intentos.");
    }
    async createCreditApplication(applicationId, selectedAmount, selectedTermMonths, companyId, userId) {
        const application = await this.loanRepo.findOne({
            where: { id: applicationId, company: { id: companyId } },
            relations: ["company"],
        });
        if (!application) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.NOT_FOUND, "La solicitud de crédito no existe.");
        }
        const company = await this.companyRepo.findOne({
            where: { id: application.companyId, owner: { id: userId } },
        });
        if (!company) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.FORBIDDEN, "La solicitud de crédito no existe.");
        }
        if (application.status !== CreditStatus_1.CreditApplicationStatus.APPLYING) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.BAD_REQUEST, "Esta solicitud ya fue confirmada.");
        }
        if (!application.offerDetails) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.BAD_REQUEST, "La solicitud no tiene una oferta calculada.");
        }
        // Validar montos y términos contra la oferta
        const { minAmount, maxAmount, allowedTerms } = application.offerDetails;
        if (selectedAmount < minAmount) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.BAD_REQUEST, `El monto mínimo permitido es ${minAmount}.`);
        }
        if (selectedAmount > maxAmount) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.BAD_REQUEST, `El monto máximo permitido es ${maxAmount}.`);
        }
        if (!allowedTerms.includes(selectedTermMonths)) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.BAD_REQUEST, `Plazo no permitido. Términos válidos: ${allowedTerms.join(", ")}.`);
        }
        // Actualizar la aplicación
        application.selectedAmount = selectedAmount;
        application.selectedTermMonths = selectedTermMonths;
        application.status = CreditStatus_1.CreditApplicationStatus.SUBMITTED;
        application.submittedAt = new Date();
        // Actualizar historial
        application.statusHistory = [
            ...(application.statusHistory || []),
            {
                status: CreditStatus_1.CreditApplicationStatus.SUBMITTED,
                timestamp: new Date(),
                changedBy: userId,
                reason: "Owner confirmó monto y plazo",
            },
        ];
        await this.loanRepo.save(application);
        (0, controller_1.broadcastLoanStatusUpdate)(userId, {
            id: application.id,
            newStatus: application.status,
            updatedAt: application.updatedAt,
        });
        return dto_1.LoanResponseDto.fromConfirmed(application, company);
    }
    async listCreditApplicationsByUserId(userId) {
        const applications = await this.loanRepo.find({
            where: { company: { owner: { id: userId } } },
            relations: ["company"],
            order: { createdAt: "DESC" },
        });
        return (0, dto_1.responseLoanByUserListDto)(applications);
    }
    async getCreditApplicationStatus(applicationId) {
        const application = await this.loanRepo.findOne({
            where: { id: applicationId },
            relations: ["company"],
        });
        if (!application) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.NOT_FOUND, "La solicitud de crédito no existe.");
        }
        return {
            status: application.status,
            applicationNumber: application.applicationNumber,
            submittedAt: application.submittedAt,
        };
    }
    async listCreditApplications(page = 1, limit = 10, status) {
        const pageNum = typeof page === 'string' ? parseInt(page, 10) : page;
        const limitNum = typeof limit === 'string' ? parseInt(limit, 10) : limit;
        const skip = (pageNum - 1) * limitNum;
        const whereCondition = {};
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
            applications: (0, dto_1.responseLoanByUserListDto)(applications),
            total,
            page: pageNum,
            totalPages,
        };
    }
    async getCreditApplicationById(applicationId) {
        const application = await this.loanRepo.findOne({
            where: { id: applicationId },
            relations: ["company"],
        });
        if (!application) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.NOT_FOUND, "La solicitud de crédito no existe.");
        }
        if (!application.company) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.NOT_FOUND, "La compañía asociada no existe.");
        }
        return dto_1.LoanResponseDto.fromExisting(application, application.company);
    }
    async deleteCreditApplication(applicationId, userId) {
        const application = await this.loanRepo.findOne({
            where: { id: applicationId },
            relations: ["company"],
        });
        if (!application) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.NOT_FOUND, "La solicitud de crédito no existe.");
        }
        // Verificar que el usuario sea el propietario de la compañía
        if (application.company.ownerId !== userId) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.FORBIDDEN, "No tienes permisos para eliminar esta solicitud.");
        }
        // Solo permitir eliminar solicitudes en estado APPLYING o SUBMITTED
        const allowedStatuses = [
            CreditStatus_1.CreditApplicationStatus.APPLYING,
            CreditStatus_1.CreditApplicationStatus.SUBMITTED,
        ];
        if (!allowedStatuses.includes(application.status)) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.BAD_REQUEST, "No se puede eliminar una solicitud que ya está en proceso de revisión.");
        }
        await this.loanRepo.remove(application);
        return { message: "Solicitud de crédito eliminada exitosamente." };
    }
    // --- MÉTODOS ADMINISTRATIVOS ---
    async updateCreditApplicationStatus(applicationId, newStatus, adminUserId, rejectionReason, internalNotes, userNotes, approvedAmount, riskScore) {
        const application = await this.loanRepo.findOne({
            where: { id: applicationId },
            relations: ["company"],
        });
        if (!application) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.NOT_FOUND, "La solicitud de crédito no existe.");
        }
        // Validar transición de estado
        const validTransitions = this.getValidStatusTransitions(application.status);
        if (!validTransitions.includes(newStatus)) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.BAD_REQUEST, `No se puede cambiar de ${application.status} a ${newStatus}. Transiciones válidas: ${validTransitions.join(", ")}`);
        }
        // Validaciones específicas por estado
        if (newStatus === CreditStatus_1.CreditApplicationStatus.REJECTED && !rejectionReason) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.BAD_REQUEST, "Se requiere una razón de rechazo para rechazar la solicitud.");
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
        if (newStatus === CreditStatus_1.CreditApplicationStatus.APPROVED) {
            application.approvedAt = now;
        }
        if (newStatus === CreditStatus_1.CreditApplicationStatus.DISBURSED) {
            application.disbursedAt = now;
        }
        // Actualizar historial de estados
        const statusHistoryEntry = {
            status: newStatus,
            timestamp: now,
            changedBy: adminUserId,
            reason: rejectionReason || userNotes || internalNotes || `Estado actualizado por administrador`,
        };
        application.statusHistory = [
            ...(application.statusHistory || []),
            statusHistoryEntry,
        ];
        if (newStatus === CreditStatus_1.CreditApplicationStatus.APPROVED) {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer sw6AK-UfwtvQW9ep3i-IPYsWPSuiJG7y7TgaR3IWSlo'
                },
                body: JSON.stringify({
                    "doc_hash": 'c83e66953f8b303697d4712ce0590e3eeaa2bbc7a0daa05001a01d764e908339', //"DOCUMENT_HASH"
                    "doc_id": application.id, //id solicitud
                    "doc_url": "https://puaqabdbobgomkjepvjc.supabase.co/storage/v1/object/public/contrato-pdf/contrato/Contrato_Prestamo_Pyme.pdf",
                    "callback": `${enviroment_config_1.default.BACKEND_URL}/api/loanRequest/firma`,
                    "return_url": `${enviroment_config_1.default.FRONTEND_URL}/panel`,
                    "description": "Contrato para pyme",
                    "external_ref": application.id
                }) // Convert the data object to a JSON string
            };
            const response = await fetch(enviroment_config_1.default.BACKEND_FIRMA, options);
            const data = await response.json();
            console.log("data ==>", data);
            if (!data.success) {
                throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.BAD_REQUEST, data.payload.error);
            }
            // const urlFirma = 'https://firma-digital-alpha.vercel.app/panel/firmar-documento?signId=IDFIRMA'
            application.requestId = data.payload.requestId;
        }
        await this.loanRepo.save(application);
        // Notificar al usuario sobre el cambio de estado
        if (application.company.ownerId) {
            (0, controller_1.broadcastLoanStatusUpdate)(application.company.ownerId, {
                id: application.id,
                newStatus: application.status,
                updatedAt: application.updatedAt,
            });
        }
        return {
            message: `Estado actualizado a ${newStatus}`,
            application: dto_1.LoanResponseDto.fromExisting(application, application.company),
        };
    }
    async getCreditApplicationsForAdmin(page = 1, limit = 10, status, companyName) {
        const pageNum = typeof page === 'string' ? parseInt(page, 10) : page;
        const limitNum = typeof limit === 'string' ? parseInt(limit, 10) : limit;
        const skip = (pageNum - 1) * limitNum;
        const whereCondition = {};
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
    async getCreditApplicationByIdForAdmin(applicationId) {
        const application = await this.loanRepo.findOne({
            where: { id: applicationId },
            relations: ["company", "company.industry", "company.owner", "company.documents", "reviewedBy", "documents"],
        });
        if (!application) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.NOT_FOUND, "La solicitud de crédito no existe.");
        }
        // Combinar documentos de la solicitud y de la compañía
        const allDocuments = [
            ...(application.documents || []),
            ...(application.company?.documents || [])
        ];
        // Eliminar duplicados por ID
        const uniqueDocuments = Array.from(new Map(allDocuments.map(doc => [doc.id, doc])).values());
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
            riskScore: application.riskScore,
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
    async getDashboardStats() {
        // Obtener todas las solicitudes
        const allApplications = await this.loanRepo.find({
            relations: ["company", "reviewedBy"],
            order: { createdAt: "DESC" },
        });
        // Calcular estadísticas
        const stats = {
            total: allApplications.length,
            approved: allApplications.filter(app => app.status === CreditStatus_1.CreditApplicationStatus.APPROVED).length,
            pending: allApplications.filter(app => app.status === CreditStatus_1.CreditApplicationStatus.SUBMITTED ||
                app.status === CreditStatus_1.CreditApplicationStatus.UNDER_REVIEW ||
                app.status === CreditStatus_1.CreditApplicationStatus.DOCUMENTS_REQUIRED).length,
            rejected: allApplications.filter(app => app.status === CreditStatus_1.CreditApplicationStatus.REJECTED).length,
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
    getValidStatusTransitions(currentStatus) {
        // Usar las transiciones definidas centralmente en CreditStatus.ts
        return CreditStatus_1.ALLOWED_STATUS_TRANSITIONS[currentStatus] || [];
    }
    async calculateLoanOptions(company) {
        // 1. Cargar TODAS las configuraciones de la base de datos
        const [systemConfigs, riskTierConfigs] = await Promise.all([
            this.systemConfigRepo.find(),
            this.riskTierConfigRepo.find(),
        ]);
        // 2. Procesar configuraciones en Mapas para fácil acceso
        const configMap = new Map();
        systemConfigs.forEach((config) => {
            configMap.set(config.key, config.value);
        });
        const riskTierConfigMap = new Map();
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
        const ageYears = (0, interface_1.computeAgeYears)(company.foundedDate);
        const revPerEmp = employeeCount && employeeCount > 0 ? revenue / employeeCount : null;
        // 4. Caso Borde: Compañía sin ingresos
        if (!revenue) {
            const tierDConfig = riskTierConfigMap.get(RiskTier_1.RiskTier.D);
            const defaultRate = BASE_RATE + Number(tierDConfig?.spread ?? 10.0);
            return {
                minAmount: ABSOLUTE_MIN_LOAN,
                maxAmount: 5000,
                interestRate: defaultRate,
                allowedTerms: [6, 12],
                calculationSnapshot: {
                    baseRate: BASE_RATE,
                    companyRiskTier: RiskTier_1.RiskTier.D,
                    industryRiskTier: company.industry?.baseRiskTier ?? RiskTier_1.RiskTier.D,
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
        const baseScore = (0, interface_1.calculateCompanyRiskScore)(companyMetrics);
        const industryTier = company.industry?.baseRiskTier ?? RiskTier_1.RiskTier.C;
        const industryAdjustment = (0, interface_1.getIndustryAdjustment)(industryTier);
        const finalScore = (0, interface_1.clamp)(baseScore + industryAdjustment, 0, 100);
        const companyTier = (0, interface_1.getTierFromScore)(finalScore); // Mapea 0-100 -> A, B, C, D
        // 6. Obtener la configuración para el Tier calculado
        const tierConfig = riskTierConfigMap.get(companyTier);
        if (!tierConfig) {
            throw new HttpError_utils_1.default(HttpStatus_1.HttpStatus.SERVER_ERROR, `Configuración para risk tier ${companyTier} no encontrada.`);
        }
        // 7. Calcular montos, plazos y tasa
        const { min, max } = (0, interface_1.capsFor)(tierConfig, revenue, {
            ABSOLUTE_MIN_LOAN,
            ABSOLUTE_MAX_LOAN,
            ROUND_TO,
        });
        // Los plazos permitidos vienen directamente del seed
        const allowedTerms = tierConfig.allowed_terms;
        // La tasa usa el 'spread' del seed + el ajuste 'intra-tier'
        const interestRate = (0, interface_1.interestRateFor)(BASE_RATE, tierConfig, finalScore);
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
exports.default = LoanService;
//# sourceMappingURL=service.js.map