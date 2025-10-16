import type { getProfileResponse } from "@/interfaces/user.interface";
import type { UserProfileFormData } from "@/schemas/user.schema";

export const getUserProfile = async (): Promise<getProfileResponse> => {
  try {
    const token = localStorage.tokenPyme

    const response = await fetch(`${import.meta.env.VITE_API_URL}/user/profile`, {
      method: "GET",
      headers: {"Content-Type": "application/json", Authorization: `Bearer ${token}`},
    });

    const result = await response.json();
    if (!response.ok) throw result;

    return result;
  } catch (error) {
    console.error("[getUserProfile]: Error fetching data:", error);
    throw error;
  }
};

export const updateUserProfile = async (data: UserProfileFormData) => {
  try {
    const token = localStorage.tokenPyme

    const response = await fetch(`${import.meta.env.VITE_API_URL}/user/profile`, {
      method: "PATCH",
      headers: {"Content-Type": "application/json", Authorization: `Bearer ${token}`},
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) throw result;

    return result;
  } catch (error) {
    console.error("[updateUserProfile]: Error fetching data:", error);
    throw error;
  }
}
