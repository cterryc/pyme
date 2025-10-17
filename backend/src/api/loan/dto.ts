import { responseLoanByUser } from "./interface";
import { CreditApplication } from "../../entities/CreditApplication.entity";
import { Company } from "../../entities/Company.entity";
import { responseLoanRequest, LoanCalculationResult } from "./interface";


/** * Mapea una solicitud de préstamo a responseLoanRequest.
 */
export function responseLoanByUserDto(loan: any): responseLoanByUser {
    return {
        nameCompany: loan.company?.legalName,
        requestAmonut: loan.selectedAmount,
        subbmitedAt: loan.submittedAt,
        status: loan.status,
    };
}
/**
/**
 * Mapea una lista de préstamos a responseLoanByUser.
 */
export function responseLoanByUserListDto(loans: any[]): responseLoanByUser[] {
    return loans.map(responseLoanByUserDto);
}


export class LoanResponseDto {
  /**
   * Mapea una solicitud existente (ya guardada) a responseLoanRequest.
   */
  static fromExisting(
    app: CreditApplication,
    company: Company
  ): responseLoanRequest {
    return {
      id: app.id,
      applicationNumber: app.applicationNumber,
      legalName: company.legalName,
      annualRevenue: company.annualRevenue,
      offerDetails: {
        minAmount: app.offerDetails!.minAmount,
        maxAmount: app.offerDetails!.maxAmount,
        interestRate: app.offerDetails!.interestRate,
        allowedTerms: app.offerDetails!.allowedTerms,
      },
      selectedDetails: app.selectedAmount
        ? {
            amount: app.selectedAmount,
            termMonths: app.selectedTermMonths,
          }
        : undefined,
    };
  }

  /**
   * Mapea una nueva solicitud recién creada con oferta calculada.
   */
  static fromNew(
    app: CreditApplication,
    company: Company,
    loanOptions: LoanCalculationResult
  ): responseLoanRequest {
    return {
      id: app.id,
      applicationNumber: app.applicationNumber,
      legalName: company.legalName,
      annualRevenue: company.annualRevenue,
      offerDetails: loanOptions,
    };
  }

  /**
   * Mapea una aplicación confirmada (createCreditApplication).
   */
  static fromConfirmed(
    app: CreditApplication,
    company: Company
  ): responseLoanRequest {
    return {
      id: app.id,
      applicationNumber: app.applicationNumber,
      legalName: company.legalName,
      annualRevenue: company.annualRevenue,
      offerDetails: {
        minAmount: app.offerDetails!.minAmount,
        maxAmount: app.offerDetails!.maxAmount,
        interestRate: app.offerDetails!.interestRate,
        allowedTerms: app.offerDetails!.allowedTerms,
      },
      selectedDetails: {
        amount: app.selectedAmount,
        termMonths: app.selectedTermMonths,
      },
    };
  }

  /**
   * Mapea resultado base por defecto (sin revenue).
   */
  static fromDefault(baseRate: number): LoanCalculationResult {
    return {
      minAmount: 1000,
      maxAmount: 5000,
      interestRate: 10,
      allowedTerms: [12],
      calculationSnapshot: {
        baseRate,
        companyRiskTier: "D",
        industryRiskTier: "D",
        riskTierConfig: null,
        systemConfigs: { BASE_RATE: baseRate },
        calculatedAt: new Date(),
        note: "Sin revenue - valores por defecto",
      },
    };
  }
}