import {
  Between,
  ILike,
  LessThanOrEqual,
  MoreThanOrEqual,
  IsNull,
  Not,
  Repository,
} from "typeorm";
import { AppDataSource } from "../../config/data-source";
import HttpError from "../../utils/HttpError.utils";
import { HttpStatus } from "../../constants/HttpStatus";
import { Company } from "../../entities/Company.entity";
import {
  toCompanyDto,
  toCompanyListDto,
  toIndustryListDto,
  createPaginatedResponse,
  toAdminCompanyListDto,
} from "./dto";
import { responseCompanyDto, PaginatedResponse } from "./interface";
import { Industry } from "../../entities/Industry.entity";
import { CreateCompanyInput, GetAllCompaniesQuery, UpdateCompanyInput } from "./validator";
import { User } from "../../entities/User.entity";
import { SystemConfig } from "../../entities/System_config.entity";
import { CreditApplication } from "../../entities/CreditApplication.entity";
import { CreditApplicationStatus } from "../../constants/CreditStatus";

export default class CompanyService {
  private readonly companyRepo: Repository<Company>;
  private readonly industryRepo: Repository<Industry>;
  private readonly userRepo: Repository<User>;
  private readonly systemConfigRepo: Repository<SystemConfig>;
  private readonly creditApplicationRepo: Repository<CreditApplication>;

  constructor() {
    this.companyRepo = AppDataSource.getRepository(Company);
    this.industryRepo = AppDataSource.getRepository(Industry);
    this.userRepo = AppDataSource.getRepository(User);
    this.systemConfigRepo = AppDataSource.getRepository(SystemConfig);
    this.creditApplicationRepo = AppDataSource.getRepository(CreditApplication);
  }

  private async getSystemLimits(): Promise<{ maxAnnualRevenue?: number; maxEmployeeCount?: number }> {
    const limits: { maxAnnualRevenue?: number; maxEmployeeCount?: number } = {};
    
    try {
      const maxRevenueConfig = await this.systemConfigRepo.findOne({
        where: { key: 'MAX_ANNUAL_REVENUE' }
      });
      
      const maxEmployeeConfig = await this.systemConfigRepo.findOne({
        where: { key: 'MAX_EMPLOYEE_COUNT' }
      });

      if (maxRevenueConfig) {
        limits.maxAnnualRevenue = maxRevenueConfig.value;
      }
      
      if (maxEmployeeConfig) {
        limits.maxEmployeeCount = maxEmployeeConfig.value;
      }
    } catch (error) {
      console.warn('Error obteniendo límites del sistema:', error);
    }
    
    return limits;
  }

  private async validateCompanyLimits(
    annualRevenue: number, 
    employeeCount: number
  ): Promise<{ exceedsLimits: boolean; reasons: string[] }> {
    const limits = await this.getSystemLimits();
    const reasons: string[] = [];
    let exceedsLimits = false;

    const maxRevenue = limits.maxAnnualRevenue ?? 50000000; // 50M por defecto
    const maxEmployees = limits.maxEmployeeCount ?? 250; // 250 empleados por defecto

    if (annualRevenue > maxRevenue) {
      exceedsLimits = true;
      reasons.push(`Los ingresos anuales (${annualRevenue}) superan el límite permitido (${maxRevenue})`);
    }

    if (employeeCount > maxEmployees) {
      exceedsLimits = true;
      reasons.push(`La cantidad de empleados (${employeeCount}) supera el límite permitido (${maxEmployees})`);
    }

    return { exceedsLimits, reasons };
  }

  private async createCreditApplicationWithNotApplicableStatus(
    companyId: string, 
    reasons: string[]
  ): Promise<void> {
    try {
      const applicationNumber = `APP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const creditApplication = this.creditApplicationRepo.create({
        applicationNumber,
        company: { id: companyId },
        status: CreditApplicationStatus.NOT_APPLICABLE,
        rejectionReason: `No aplica: ${reasons.join(', ')}`,
        statusHistory: [{
          status: CreditApplicationStatus.NOT_APPLICABLE,
          timestamp: new Date(),
          reason: `No aplica: ${reasons.join(', ')}`
        }]
      });

      await this.creditApplicationRepo.save(creditApplication);
    } catch (error) {
      console.error('Error creando solicitud de crédito con estado no aplica:', error);
    }
  }

  async createCompany(
    companyData: CreateCompanyInput,
    ownerUserId: string
  ): Promise<responseCompanyDto> {
    const userExists = await this.userRepo.findOne({
      where: { id: ownerUserId },
    });

    if (!userExists) {
      throw new HttpError(HttpStatus.NOT_FOUND, "Usuario no encontrado.");
    }

    const whereConditions: Array<{ taxId?: string; email?: string }> = [
      { taxId: companyData.taxId },
    ];

    if (companyData.email) {
      whereConditions.push({ email: companyData.email });
    }

    const exists = await this.companyRepo.findOne({
      where: whereConditions,
    });

    if (exists) {
      if (exists.taxId === companyData.taxId) {
        throw new HttpError(
          HttpStatus.BAD_REQUEST,
          "La compañía con ese RUC/taxId ya fue registrada."
        );
      }
      if (companyData.email && exists.email === companyData.email) {
        throw new HttpError(
          HttpStatus.BAD_REQUEST,
          "El correo electrónico ya está asociado a otra compañía."
        );
      }
      throw new HttpError(HttpStatus.BAD_REQUEST, "La compañía ya existe.");
    }

    const industry = await this.industryRepo.findOne({
      where: { id: companyData.industryId },
    });

    if (!industry) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        "La industria especificada con ese ID no existe."
      );
    }

    const validation = await this.validateCompanyLimits(
      companyData.annualRevenue, 
      companyData.employeeCount
    );

    const newCompany = this.companyRepo.create({
      ...companyData,
      owner: { id: ownerUserId },
      industry: industry,
    });

    const savedCompany = await this.companyRepo.save(newCompany);

    if (validation.exceedsLimits) {
      await this.createCreditApplicationWithNotApplicableStatus(
        savedCompany.id, 
        validation.reasons
      );
    }

    // Recargar la company con las relaciones para el DTO
    const companyWithRelations = await this.companyRepo.findOne({
      where: { id: savedCompany.id },
      relations: ["industry", "creditApplications"],
    });

    return toCompanyDto(companyWithRelations!);
  }

  async listCompaniesByUserId(userId: string): Promise<responseCompanyDto[]> {
    const companies = await this.companyRepo.find({
      where: { owner: { id: userId }, deletedAt: IsNull() },
      order: { createdAt: "DESC" },
      relations: ["documents", "industry", "creditApplications", "owner"],
    });

    return toCompanyListDto(companies);
  }

  async getCompanyById(
    companyId: string,
    userId: string
  ): Promise<responseCompanyDto | null> {
    const company = await this.companyRepo.findOne({
      where: { id: companyId, owner: { id: userId } },
      relations: ["industry", "creditApplications"],
    });

    if (!company) {
      throw new HttpError(HttpStatus.NOT_FOUND, "La compania no existe.");
    }

    return toCompanyDto(company);
  }

  async updateCompany(
    companyId: string,
    companyData: UpdateCompanyInput,
    userId: string
  ): Promise<Company  | null> {
    const company = await this.companyRepo.findOne({
      where: { id: companyId, owner: { id: userId } },
    });
    if (!company) {
      return null;
    }

    const whereConditions = [];

    if (companyData.taxId && companyData.taxId !== company.taxId) {
      whereConditions.push({ taxId: companyData.taxId });
    }

    if (companyData.email && companyData.email !== company.email) {
      whereConditions.push({ email: companyData.email });
    }

    if (whereConditions.length > 0) {
      const isDuplicated = await this.companyRepo.findOne({
        where: whereConditions.map((condition) => ({
          ...condition,
          id: Not(companyId),
        })),
      });

      if (isDuplicated) {
        if (isDuplicated.taxId === companyData.taxId) {
          throw new HttpError(
            HttpStatus.BAD_REQUEST,
            "El RUC/taxId ya pertenece a otra compañía."
          );
        }
        if (isDuplicated.email === companyData.email) {
          throw new HttpError(
            HttpStatus.BAD_REQUEST,
            "El correo electrónico ya está en uso por otra compañía."
          );
        }
      }
    }

    if (companyData.industryId !== undefined) {
      if (companyData.industryId === null) {
        company.industry = undefined;
      } else {
        const industry = await this.industryRepo.findOne({
          where: { id: companyData.industryId },
        });

        if (!industry) {
          throw new HttpError(
            HttpStatus.BAD_REQUEST,
            "La industria especificada con ese ID no existe."
          );
        }

        company.industry = industry;
      }
      const { industryId: _industryId, ...restData } = companyData;
      this.companyRepo.merge(company, restData);
    } else {
      this.companyRepo.merge(company, companyData);
    }
    
    return this.companyRepo.save(company);
  }

  async deleteCompanyByUser(
    companyId: string,
    userId: string
  ): Promise<Company | null> {
    const company = await this.companyRepo.findOne({
      where: { id: companyId, owner: { id: userId } },
    });
    if (!company) {
      return null;
    }
    await this.companyRepo.softDelete({ id: company.id });
    return company;
  }

  async getIndustries(): Promise<Industry[]> {
    const industries = await this.industryRepo.find({
      order: { name: "ASC" },
    });

    return toIndustryListDto(industries);
  }

  async getAllCompanies(
    query: GetAllCompaniesQuery
  ): Promise<PaginatedResponse<any>> {
    const {
      page,
      limit,
      industryId,
      status,
      deleted,
      search,
      createdAtFrom,
      createdAtTo,
      foundedDateFrom,
      foundedDateTo,
      sortBy,
      sortOrder,
    } = query;

    // Construir WHERE conditions
    const whereConditions: any = {};

    // Filtro de eliminados
    if (deleted === "true") {
      whereConditions.deletedAt = Not(IsNull());
    } else if (deleted === "false") {
      whereConditions.deletedAt = IsNull();
    }
    // Si deleted === 'all', no agregamos filtro

    // Filtro por industria
    if (industryId) {
      whereConditions.industry = { id: industryId };
    }

    // Búsqueda por legalName o taxId
    const searchConditions = [];
    if (search) {
      searchConditions.push(
        { ...whereConditions, legalName: ILike(`%${search}%`) },
        { ...whereConditions, taxId: ILike(`%${search}%`) }
      );
    }

    // Filtro por rango de createdAt
    if (createdAtFrom && createdAtTo) {
      whereConditions.createdAt = Between(createdAtFrom, createdAtTo);
    } else if (createdAtFrom) {
      whereConditions.createdAt = MoreThanOrEqual(createdAtFrom);
    } else if (createdAtTo) {
      whereConditions.createdAt = LessThanOrEqual(createdAtTo);
    }

    // Filtro por rango de foundedDate
    if (foundedDateFrom && foundedDateTo) {
      whereConditions.foundedDate = Between(foundedDateFrom, foundedDateTo);
    } else if (foundedDateFrom) {
      whereConditions.foundedDate = MoreThanOrEqual(foundedDateFrom);
    } else if (foundedDateTo) {
      whereConditions.foundedDate = LessThanOrEqual(foundedDateTo);
    }

    // Construir query builder para filtro complejo de status
    const queryBuilder = this.companyRepo
      .createQueryBuilder("company")
      .leftJoinAndSelect("company.industry", "industry")
      .leftJoinAndSelect("company.documents", "documents")
      .leftJoinAndSelect("company.creditApplications", "creditApplications")
      .withDeleted(); // Incluye soft deleted para poder filtrarlos

    // Aplicar whereConditions básicos
    if (searchConditions.length > 0) {
      searchConditions.forEach((condition, index) => {
        if (index === 0) {
          queryBuilder.where(condition);
        } else {
          queryBuilder.orWhere(condition);
        }
      });
    } else {
      queryBuilder.where(whereConditions);
    }

    // Filtro por status de creditApplications
    if (status) {
      queryBuilder.andWhere("creditApplications.status = :status", { status });
    }

    // Ordenamiento
    const orderField =
      sortBy === "legalName" ? "company.legalName" : "company.createdAt";
    queryBuilder.orderBy(orderField, sortOrder);

    // Paginación
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Ejecutar query
    const [companies, total] = await queryBuilder.getManyAndCount();

    // Transformar a DTO
    const companiesDto = toAdminCompanyListDto(companies);

    return createPaginatedResponse(companiesDto, total, page, limit);
  }

  // async getAllCompanies(): Promise<Company[]> {
  //     return this.companyRepo.find({ relations: ["user", "creditApplications", "documents"] });
  // }

  // async getCompaniesByUserId(userId: number): Promise<Company[]> {
  //     return this.companyRepo.find({
  //         where: { user: { id: userId } },
  //         relations: ["user", "creditApplications", "documents"],
  //     });
  // }

  // async removeDocumentFromCompany(companyId: number, documentId: number): Promise<Company | null> {
  //     const company = await this.companyRepo.findOne({
  //         where: { id: companyId },
  //         relations: ["documents"],
  //     });
  //     if (!company) {
  //         return null;
  //     }
  //     const document = company.documents.find(doc => doc.id === documentId);
  //     if (!document) {
  //         return null;
  //     }
  //     company.documents = company.documents.filter(doc => doc.id !== documentId);
  //     await this.companyRepo.save(company);
  //     return company;
  // }
}
