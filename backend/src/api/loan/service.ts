import { IsNull, Not, Repository } from "typeorm";
import { AppDataSource } from "../../config/data-source";
import HttpError from "../../utils/HttpError.utils";
import { HttpStatus } from "../../constants/HttpStatus";
import { CreditApplication } from "../../entities/CreditApplication.entity";
import { Company } from "../../entities/Company.entity";
import { User } from "../../entities/User.entity";
import { CreditApplicationStatus } from "../../constants/CreditStatus";
import { adjustTier, allowedTermsFor, baseTierByIndustry, capsFor, computeAgeYears, interestRateFor,  } from "./interface";
import { responseLoanRequest } from "./interface";

export default class LoanService {
  private readonly loanRepo: Repository<CreditApplication>;
  private readonly companyRepo: Repository<Company>;
  private readonly userRepo: Repository<User>;

  constructor() {
      this.loanRepo = AppDataSource.getRepository(CreditApplication);
      this.companyRepo = AppDataSource.getRepository(Company);
      this.userRepo = AppDataSource.getRepository(User);
    }

  async loanRequest(
    userId: string,
    companyId: string
  ): Promise<responseLoanRequest> {
    const company = await this.companyRepo.findOne({
      where: { id: companyId, owner: { id: userId } },
    });

    if (!company) {
      throw new HttpError(
                HttpStatus.NOT_FOUND,
                "La compañía no existe."
              );
    }

    const loanRequest = await this.loanRepo.findOne({
        where: { company: { id: company.id }, status: Not(CreditApplicationStatus.DRAFT) },
    });

    if (loanRequest) {
      throw new HttpError(
        HttpStatus.NOT_FOUND,
        "Ya existe una solicitud de crédito para esta pyme."
      );
    }

    const loanOptions = await this.getLoanOptions(company);

    return loanOptions;
  }


  async getLoanOptions(company: Company): Promise<responseLoanRequest> {
  const revenue = Math.max(0, Number(company.annualRevenue ?? 0));
  const emp = company.employeeCount ?? null;
  const ageYears = computeAgeYears(company.foundedDate ?? null);
  const revPerEmp = emp && emp > 0 ? revenue / emp : null;

  if (!revenue) {
    return {
      minAmount: 1000,
      maxAmount: 5000,
      paymentOptions: {
        paymentNumber: 12,
        interestRate: 10,
      },
    };
  }

  const baseTier = baseTierByIndustry(company.industry ?? null);
  const tier = adjustTier(baseTier, ageYears, revPerEmp);

  const { min, max } = capsFor(tier, revenue);

  const terms = allowedTermsFor(tier, ageYears, revenue > 0);
  const recommended = terms[Math.floor(terms.length / 2)];

  const rate = interestRateFor(tier, ageYears, revPerEmp);

  const loanOptions: responseLoanRequest = {
    minAmount: min,
    maxAmount: max,
    paymentOptions: {
      paymentNumber: recommended,
      interestRate: rate,
    },
  };

  return loanOptions;
}

  async createCreditApplication(
    loanData: Partial<CreditApplication>,
    pymeId: string
  ): Promise<void> {
    // Lógica para crear la solicitud de crédito
  }

    async getCreditApplicationStatus(
    applicationId: string
  ): Promise<string> {
    // Lógica para obtener el estado de la solicitud de crédito
    return "PENDING";
  }



}
