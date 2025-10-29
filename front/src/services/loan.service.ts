import type { ListCreditApplicationsResponse, LoanCreditRequestResponse } from "@/interfaces/loan.interface";

export const getListCreditApplicationsByUser = async (): Promise<ListCreditApplicationsResponse> => {
  try {
    const token = localStorage.tokenPyme

    const response = await fetch(`${import.meta.env.VITE_API_URL}/loanRequest/user`, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    });

    const result = await response.json();
    if (!response.ok) throw result;

    return result;
  } catch (error) {
    console.error("[getListCreditApplicationsByUser]: Error fetching data:", error);
    throw error;
  }
};

export const getCreditApplicationById = async (id: string): Promise<LoanCreditRequestResponse> => {
  try {
    const token = localStorage.tokenPyme

    const response = await fetch(`${import.meta.env.VITE_API_URL}/loanRequest/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    });

    const result = await response.json();
    if (!response.ok) throw result;

    return result;
  } catch(error) {
    console.error("[getCreditApplicationById]: Error fetching data:", error);
    throw error;
  }

}