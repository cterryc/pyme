import { IsNull, Repository } from "typeorm";
import { AppDataSource } from "../../config/data-source";
import HttpError from "../../utils/HttpError.utils";
import { HttpStatus } from "../../constants/HttpStatus";
import { Company } from "../../entities/Company.entity";

export default class CompanyService {
  private readonly companyRepo: Repository<Company>;

  constructor() {
    this.companyRepo = AppDataSource.getRepository(Company);
  }

  async createCompany(
    companyData: Partial<Company>,
    ownerUserId: string
  ): Promise<Company> {
    const exists = await this.companyRepo.findOne({
      where: { taxId: companyData.taxId },
    });
    if (exists) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "La compañía con ese taxId ya fue creada.");
    }

    const entity = this.companyRepo.create({
      ...companyData,
      owner: { id: ownerUserId },
    });

    const saved = await this.companyRepo.save(entity);

    return saved;
  }

  async listCompanies(userId: string): Promise<Company[]> {
    return this.companyRepo.find({
      where: { owner: { id: userId }, deletedAt: IsNull() },
      order: { createdAt: "DESC" },
    });
  }

  // async getCompanyById(companyId: number): Promise<Company | null> {
  //     return this.companyRepo.findOne({
  //         where: { id: companyId },
  //         relations: ["user", "creditApplications", "documents"], // Asegúrate de cargar las relaciones necesarias
  //     });
  // }

  // async updateCompany(companyId: string, companyData: Partial<Company>): Promise<Company | null> {
  //     const company = await this.companyRepo.findOne({ where: { id: parseInt(companyId, 10) } });
  //     if (!company) {
  //         return null;
  //     }
  //     this.companyRepo.merge(company, companyData);
  //     return this.companyRepo.save(company);
  // }

  // async deleteCompany(companyId: number): Promise<Company | null> {
  //     const company = await this.companyRepo.findOne({ where: { id: companyId } });
  //     if (!company) {
  //         return null;
  //     }
  //     await this.companyRepo.remove(company);
  //     return company;
  // }

  // async getAllCompanies(): Promise<Company[]> {
  //     return this.companyRepo.find({ relations: ["user", "creditApplications", "documents"] });
  // }

  // async getCompaniesByUserId(userId: number): Promise<Company[]> {
  //     return this.companyRepo.find({
  //         where: { user: { id: userId } },
  //         relations: ["user", "creditApplications", "documents"],
  //     });
  // }

  // async addDocumentToCompany(companyId: number, documentId: number): Promise<Company | null> {
  //     const company = await this.companyRepo.findOne({
  //         where: { id: companyId },
  //         relations: ["documents"],
  //     });
  //     if (!company) {
  //         return null;
  //     }
  //     const document = await this.documentRepo.findOne({ where: { id: documentId } });
  //     if (!document) {
  //         return null;
  //     }
  //     company.documents.push(document);
  //     await this.companyRepo.save(company);
  //     return company;
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
