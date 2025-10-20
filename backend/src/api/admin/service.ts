import { FindManyOptions, ILike, LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm";
import { AppDataSource } from "../../config/data-source";
import HttpError from "../../utils/HttpError.utils";
import { HttpStatus } from "../../constants/HttpStatus";
import { CreditApplication } from "../../entities/CreditApplication.entity";
import { CreditApplicationStatus } from "../../constants/CreditStatus";
import {
  CreditApplicationListItemDto,
  CreditApplicationDetailDto,
  toCreditApplicationListItemDto,
  toCreditApplicationDetailDto,
} from "./dto";
import { broadcastLoanStatusUpdate } from "../sse/controller";

export interface ListCreditApplicationsParams {
  page: number;
  limit: number;
  sortBy: "createdAt" | "submittedAt" | "selectedAmount" | "status";
  sortOrder: "ASC" | "DESC";
  status?: CreditApplicationStatus;
  companyId?: string;
  applicationNumber?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface PaginatedCreditApplications {
  data: CreditApplicationListItemDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UpdateCreditApplicationStatusParams {
  status: CreditApplicationStatus;
  reason?: string;
  internalNotes?: string;
  approvedAmount?: number;
  riskScore?: number;
}

export default class AdminLoanService {
  private readonly loanRepo: Repository<CreditApplication>;

  constructor() {
    this.loanRepo = AppDataSource.getRepository(CreditApplication);
  }

  /**
   * Lista todas las solicitudes de crédito con paginación y filtros (Admin)
   */
  async listCreditApplications(
    params: ListCreditApplicationsParams
  ): Promise<PaginatedCreditApplications> {
    const {
      page,
      limit,
      sortBy,
      sortOrder,
      status,
      companyId,
      applicationNumber,
      minAmount,
      maxAmount,
      search,
      startDate,
      endDate,
    } = params;

    // Construir condiciones WHERE
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (companyId) {
      where.company = { id: companyId };
    }

    if (applicationNumber) {
      where.applicationNumber = ILike(`%${applicationNumber}%`);
    }

    if (minAmount !== undefined) {
      where.selectedAmount = MoreThanOrEqual(minAmount);
    }

    if (maxAmount !== undefined) {
      where.selectedAmount = where.selectedAmount
        ? { ...where.selectedAmount, [Symbol.for("lessThanOrEqual")]: maxAmount }
        : LessThanOrEqual(maxAmount);
    }

    if (startDate) {
      where.submittedAt = MoreThanOrEqual(new Date(startDate));
    }

    if (endDate) {
      where.submittedAt = where.submittedAt
        ? { ...where.submittedAt, [Symbol.for("lessThanOrEqual")]: new Date(endDate) }
        : LessThanOrEqual(new Date(endDate));
    }

    // Búsqueda general en legalName o applicationNumber
    // Nota: La búsqueda en relaciones requiere QueryBuilder
    const queryBuilder = this.loanRepo
      .createQueryBuilder("app")
      .leftJoinAndSelect("app.company", "company")
      .leftJoinAndSelect("company.owner", "owner")
      .leftJoinAndSelect("company.industry", "industry")
      .leftJoinAndSelect("app.documents", "documents");

    // Aplicar filtros dinámicos
    if (status) {
      queryBuilder.andWhere("app.status = :status", { status });
    }

    if (companyId) {
      queryBuilder.andWhere("app.companyId = :companyId", { companyId });
    }

    if (applicationNumber) {
      queryBuilder.andWhere("app.applicationNumber ILIKE :applicationNumber", {
        applicationNumber: `%${applicationNumber}%`,
      });
    }

    if (minAmount !== undefined) {
      queryBuilder.andWhere("app.selectedAmount >= :minAmount", { minAmount });
    }

    if (maxAmount !== undefined) {
      queryBuilder.andWhere("app.selectedAmount <= :maxAmount", { maxAmount });
    }

    if (startDate) {
      queryBuilder.andWhere("app.submittedAt >= :startDate", {
        startDate: new Date(startDate),
      });
    }

    if (endDate) {
      queryBuilder.andWhere("app.submittedAt <= :endDate", {
        endDate: new Date(endDate),
      });
    }

    // Búsqueda general
    if (search) {
      queryBuilder.andWhere(
        "(company.legalName ILIKE :search OR app.applicationNumber ILIKE :search OR owner.email ILIKE :search)",
        { search: `%${search}%` }
      );
    }

    // Ordenamiento
    const orderField = sortBy === "selectedAmount" ? "app.selectedAmount" : `app.${sortBy}`;
    queryBuilder.orderBy(orderField, sortOrder);

    // Paginación
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Ejecutar query
    const [applications, total] = await queryBuilder.getManyAndCount();

    return {
      data: applications.map(toCreditApplicationListItemDto),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Obtiene el detalle completo de una solicitud de crédito (Admin)
   */
  async getCreditApplicationDetails(
    applicationId: string
  ): Promise<CreditApplicationDetailDto> {
    const application = await this.loanRepo.findOne({
      where: { id: applicationId },
      relations: [
        "company",
        "company.owner",
        "company.industry",
        "documents",
        "reviewedBy",
      ],
    });

    if (!application) {
      throw new HttpError(
        HttpStatus.NOT_FOUND,
        "La solicitud de crédito no existe."
      );
    }

    return toCreditApplicationDetailDto(application);
  }

  /**
   * Actualiza el estado de una solicitud de crédito (Admin)
   */
  async updateCreditApplicationStatus(
    applicationId: string,
    adminUserId: string,
    params: UpdateCreditApplicationStatusParams
  ): Promise<CreditApplicationDetailDto> {
    const { status, reason, internalNotes, approvedAmount, riskScore } = params;

    const application = await this.loanRepo.findOne({
      where: { id: applicationId },
      relations: [
        "company",
        "company.owner",
        "company.industry",
        "documents",
        "reviewedBy",
      ],
    });

    if (!application) {
      throw new HttpError(
        HttpStatus.NOT_FOUND,
        "La solicitud de crédito no existe."
      );
    }

    // Validaciones de transición de estado
    this.validateStatusTransition(application.status, status);

    // Actualizar campos básicos
    const oldStatus = application.status;
    application.status = status;

    if (reason && status === CreditApplicationStatus.REJECTED) {
      application.rejectionReason = reason;
    }

    if (internalNotes) {
      application.internalNotes = internalNotes;
    }

    if (approvedAmount !== undefined && status === CreditApplicationStatus.APPROVED) {
      application.approvedAmount = approvedAmount;
    }

    if (riskScore !== undefined) {
      application.riskScore = riskScore;
    }

    // Actualizar fechas según el estado
    if (status === CreditApplicationStatus.UNDER_REVIEW && !application.reviewedAt) {
      application.reviewedAt = new Date();
      application.reviewedById = adminUserId;
    }

    if (status === CreditApplicationStatus.APPROVED) {
      application.approvedAt = new Date();
      application.reviewedById = adminUserId;
    }

    if (status === CreditApplicationStatus.DISBURSED) {
      application.disbursedAt = new Date();
    }

    // Actualizar historial
    application.statusHistory = [
      ...(application.statusHistory || []),
      {
        status,
        timestamp: new Date(),
        changedBy: adminUserId,
        reason: reason || `Estado cambiado de ${oldStatus} a ${status}`,
      },
    ];

    // Guardar cambios
    await this.loanRepo.save(application);

    // Broadcast SSE al usuario dueño de la compañía
    const ownerId = application.company.owner.id;
    broadcastLoanStatusUpdate(ownerId, {
      id: application.id,
      newStatus: application.status,
      updatedAt: application.updatedAt,
    });

    console.log(
      `[Admin] Solicitud ${application.applicationNumber} cambió de ${oldStatus} a ${status} por admin ${adminUserId}`
    );

    return toCreditApplicationDetailDto(application);
  }

  /**
   * Valida transiciones de estado permitidas
   */
  private validateStatusTransition(
    currentStatus: CreditApplicationStatus,
    newStatus: CreditApplicationStatus
  ): void {
    // Mapa de transiciones permitidas
    const allowedTransitions: Record<CreditApplicationStatus, CreditApplicationStatus[]> = {
      [CreditApplicationStatus.DRAFT]: [CreditApplicationStatus.APPLYING],
      [CreditApplicationStatus.APPLYING]: [
        CreditApplicationStatus.SUBMITTED,
        CreditApplicationStatus.CANCELLED,
      ],
      [CreditApplicationStatus.SUBMITTED]: [
        CreditApplicationStatus.UNDER_REVIEW,
        CreditApplicationStatus.CANCELLED,
      ],
      [CreditApplicationStatus.UNDER_REVIEW]: [
        CreditApplicationStatus.DOCUMENTS_REQUIRED,
        CreditApplicationStatus.APPROVED,
        CreditApplicationStatus.REJECTED,
      ],
      [CreditApplicationStatus.DOCUMENTS_REQUIRED]: [
        CreditApplicationStatus.UNDER_REVIEW,
        CreditApplicationStatus.REJECTED,
      ],
      [CreditApplicationStatus.APPROVED]: [
        CreditApplicationStatus.DISBURSED,
        CreditApplicationStatus.CANCELLED,
      ],
      [CreditApplicationStatus.REJECTED]: [],
      [CreditApplicationStatus.DISBURSED]: [],
      [CreditApplicationStatus.CANCELLED]: [],
    };

    const allowed = allowedTransitions[currentStatus] || [];

    if (!allowed.includes(newStatus)) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        `No se puede cambiar el estado de ${currentStatus} a ${newStatus}.`
      );
    }
  }
}
