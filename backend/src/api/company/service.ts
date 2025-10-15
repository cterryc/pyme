import { IsNull, Not, Repository } from "typeorm";
import { AppDataSource } from "../../config/data-source";
import HttpError from "../../utils/HttpError.utils";
import { HttpStatus } from "../../constants/HttpStatus";
import { Company } from "../../entities/Company.entity";
import { toCompanyDto, toCompanyListDto, toIndustryListDto } from "./dto";
import { responseCompanyDto } from "./interface";
import { Industry } from "../../entities/Industry.entity";
import { CreateCompanyInput } from "./validator";

export default class CompanyService {
  private readonly companyRepo: Repository<Company>;
  private readonly industryRepo: Repository<Industry> = AppDataSource.getRepository(Industry);

  constructor() {
    this.companyRepo = AppDataSource.getRepository(Company);
    this.industryRepo = AppDataSource.getRepository(Industry);
  }

  async createCompany(
    companyData: CreateCompanyInput, 
    ownerUserId: string
  ): Promise<responseCompanyDto> {
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

       
        const newCompany = this.companyRepo.create({
            ...companyData,
            owner: { id: ownerUserId },
            industry: industry,
        });

        const savedCompany = await this.companyRepo.save(newCompany);

        return toCompanyDto(savedCompany); 
  }

  async listCompaniesByUserId(userId: string): Promise<responseCompanyDto[]> {
    const companies = await this.companyRepo.find({
      where: { owner: { id: userId }, deletedAt: IsNull() },
      order: { createdAt: "DESC" },
      relations: ["documents", "creditApplications", "owner"],
    });

    return toCompanyListDto(companies);
  }

  async getCompanyById(
    companyId: string,
    userId: string
  ): Promise<responseCompanyDto | null> {
    const company = await this.companyRepo.findOne({
      where: { id: companyId, owner: { id: userId } },
      relations: ["industry"]
    });

    if (!company) {
      throw new HttpError(HttpStatus.NOT_FOUND, "La compania no existe.");
    }

    return toCompanyDto(company);
  }

  async updateCompany(
    companyId: string,
    companyData: Partial<Company>,
    userId: string
  ): Promise<Object | null> {
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
    this.companyRepo.merge(company, companyData);
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
