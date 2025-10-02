import { type RegisterFormData } from "@/schemas/auth.schema";

export const authRegister = async (data: RegisterFormData) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Error registering user');
    return result;
  } catch (error) {
    console.error("[authRegister]: Error fetching data:", error);
    throw error;
  }
};
