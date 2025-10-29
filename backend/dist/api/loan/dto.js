"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanResponseDto = void 0;
exports.responseLoanByUserDto = responseLoanByUserDto;
exports.responseLoanByUserListDto = responseLoanByUserListDto;
/** * Mapea una solicitud de préstamo a responseLoanRequest.
 */
function responseLoanByUserDto(loan) {
    return {
        nameCompany: loan.company?.legalName,
        requestAmonut: loan.selectedAmount,
        subbmitedAt: loan.submittedAt,
        notes: loan.userNotes,
        status: loan.status,
    };
}
/**
/**
 * Mapea una lista de préstamos a responseLoanByUser.
 */
function responseLoanByUserListDto(loans) {
    return loans.map(responseLoanByUserDto);
}
class LoanResponseDto {
    /**
     * Mapea una solicitud existente (ya guardada) a responseLoanRequest.
     */
    static fromExisting(app, company) {
        return {
            id: app.id,
            applicationNumber: app.applicationNumber,
            legalName: company.legalName,
            annualRevenue: company.annualRevenue,
            offerDetails: {
                minAmount: app.offerDetails.minAmount,
                maxAmount: app.offerDetails.maxAmount,
                interestRate: app.offerDetails.interestRate,
                allowedTerms: app.offerDetails.allowedTerms,
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
    static fromNew(app, company, loanOptions) {
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
    static fromConfirmed(app, company) {
        return {
            id: app.id,
            applicationNumber: app.applicationNumber,
            legalName: company.legalName,
            annualRevenue: company.annualRevenue,
            offerDetails: {
                minAmount: app.offerDetails.minAmount,
                maxAmount: app.offerDetails.maxAmount,
                interestRate: app.offerDetails.interestRate,
                allowedTerms: app.offerDetails.allowedTerms,
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
    static fromDefault(baseRate) {
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
exports.LoanResponseDto = LoanResponseDto;
