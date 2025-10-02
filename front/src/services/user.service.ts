import type { UserData } from "@/interfaces/user.interface";

const token = localStorage.getItem("token")

export const getUser = async (): Promise<UserData> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Error fetching user data");
    return result;
  } catch (error) {
    console.error("[getUser]: Error fetching data:", error);
    throw error;
  }
};
