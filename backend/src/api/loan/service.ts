import { In, Not, Or, Repository } from "typeorm";
import { AppDataSource } from "../../config/data-source";
import HttpError from "../../utils/HttpError.utils";
import { HttpStatus } from "../../constants/HttpStatus";
import { CreditApplication } from "../../entities/CreditApplication.entity";
import { Company } from "../../entities/Company.entity";
import { CreditApplicationStatus } from "../../constants/CreditStatus";
import {
  adjustTier,
  allowedTermsFor,
  baseTierByIndustry,
  capsFor,
  computeAgeYears,
  interestRateFor,
} from "./interface";
import { responseLoanRequest } from "./interface";
import { generateUniqueCode } from "../../utils/generateCode.utils";

const excludedStatuses = [
  CreditApplicationStatus.SUBMITTED,
  CreditApplicationStatus.UNDER_REVIEW,
];

export default class LoanService {
  private readonly loanRepo: Repository<CreditApplication>;
  private readonly companyRepo: Repository<Company>;

  constructor() {
    this.loanRepo = AppDataSource.getRepository(CreditApplication);
    this.companyRepo = AppDataSource.getRepository(Company);
  }

  async loanRequest(
    userId: string,
    companyId: string
  ): Promise<responseLoanRequest> {
    const company = await this.companyRepo.findOne({
      where: { id: companyId, owner: { id: userId } },
    });

    if (!company) {
      throw new HttpError(HttpStatus.NOT_FOUND, "La compañía no existe.");
    }

    const loanRequest = await this.loanRepo.findOne({
      where: { company: { id: company.id }, status: In(excludedStatuses) },
    });

    console.log(loanRequest);

    if (loanRequest) {
      return {
        aplicationNumber: loanRequest.applicationNumber,
        minAmount: loanRequest.minAmount!,
        maxAmount: loanRequest.maxAmount!,
        paymentOptions: {
          paymentNumber: loanRequest.paymentNumber!,
          interestRate: loanRequest.interestRate!,
        },
      };
    }

    const loanOptions = await this.getLoanOptions(company);

    const { minAmount, maxAmount, paymentOptions } = loanOptions;

    const code = await generateUniqueCode("CRD");

    const newLoanRequest = this.loanRepo.create({
      applicationNumber: code,
      company,
      minAmount,
      maxAmount,
      ...paymentOptions,
      status: CreditApplicationStatus.SUBMITTED,
    });

    await this.loanRepo.save(newLoanRequest);

    const response: responseLoanRequest = {
      aplicationNumber: newLoanRequest.applicationNumber,
      minAmount,
      maxAmount,
      paymentOptions,
    };

    return response;
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
    userId: string
  ): Promise<responseLoanRequest | null> {
    const company = await this.companyRepo.findOne({
      where: { id: loanData.companyId, owner: { id: userId } },
    });

    if (!company) {
      throw new HttpError(HttpStatus.NOT_FOUND, "La compañía no existe.");
    }


    const loanRequest = await this.loanRepo.findOne({
      where: { id: loanData.id, company: { id: company.id } },
    });

    if (!loanRequest) {
      throw new HttpError(
        HttpStatus.NOT_FOUND,
        "La solicitud de crédito no existe."
      );
    }

    if( loanRequest.confirmed ) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        "La solicitud de crédito ya ha sido confirmada."
      );
    }

    if (loanData.amount! < loanRequest.minAmount!) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        `El monto mínimo para la solicitud de crédito es ${loanRequest.minAmount}.`
      );
    }

    if (loanData.amount! > loanRequest.maxAmount!) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        `El monto máximo para la solicitud de crédito es ${loanRequest.maxAmount}.`
      );
    }

    loanRequest.confirmed = true;
    loanRequest.amount = loanData.amount;

    await this.loanRepo.save(loanRequest);

    return {
      aplicationNumber: loanRequest.applicationNumber,
      minAmount: loanRequest.minAmount!,
      maxAmount: loanRequest.maxAmount!,
      paymentOptions: {
        paymentNumber: loanRequest.paymentNumber!,
        interestRate: loanRequest.interestRate!,
      },
    };
  }

  async getCreditApplicationStatus(applicationId: string): Promise<string> {
    // Lógica para obtener el estado de la solicitud de crédito
    return "PENDING";
  }
}
