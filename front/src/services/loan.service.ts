import type { ListCreditApplications } from "@/interfaces/loan.interface";

export const getListCreditApplications = async (): Promise<ListCreditApplications> => {
  try {
    const token = localStorage.tokenPyme

    const response = await fetch(`${import.meta.env.VITE_API_URL}/loanRequest/<definir en endpoint en backend>`, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    });

    const result = await response.json();
    if (!response.ok) throw result;

    return result;
  } catch (error) {
    console.error("[getListCreditApplications]: Error fetching data:", error);
    throw error;
  }
};
