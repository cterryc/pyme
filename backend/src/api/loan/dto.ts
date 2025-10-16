import { responseLoanByUser } from "./interface";

export function responseLoanByUserDto(loan: any): responseLoanByUser {
    return {
        nameCompany: loan.company?.legalName,
        requestAmonut: loan.selectedAmount,
        subbmitedAt: loan.submittedAt,
        status: loan.status,
    };
}


export function responseLoanByUserListDto(loans: any[]): responseLoanByUser[] {
    return loans.map(responseLoanByUserDto);
}