import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface EmailVerificationProps {
  onVerificationSuccess?: () => void;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({
  onVerificationSuccess,
}) => {
  const [token, setToken] = useState<string[]>(Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener el correo del usuario desde localStorage
    const email = localStorage.getItem("userEmail");
    if (email) {
      setUserEmail(email);
    }
  }, []);

  const handleTokenChange = (index: number, value: string) => {
    // Solo permitir números
    if (!/^\d*$/.test(value)) return;

    const newToken = [...token];
    newToken[index] = value;
    setToken(newToken);

    // Auto-focus al siguiente input
    if (value !== "" && index < 5) {
      const nextInput = document.getElementById(`token-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && token[index] === "" && index > 0) {
      const prevInput = document.getElementById(`token-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setToken(digits);
      // Focus al último input
      const lastInput = document.getElementById("token-5");
      if (lastInput) lastInput.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fullToken = token.join("");
    if (fullToken.length !== 6) {
      setError("Por favor, ingresa el código de 6 dígitos");
      return;
    }

    if (!userEmail) {
      setError(
        "No se encontró el correo electrónico. Por favor, intenta registrarte nuevamente."
      );
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/verify-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: fullToken,
            email: userEmail,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Éxito en la verificación
        navigate("/panel/perfil");
        if (onVerificationSuccess) {
          onVerificationSuccess();
        }
      } else {
        setError(data.message || "Error al verificar el correo electrónico");
      }
    } catch (err) {
      console.log(err);
      setError("Error de conexión. Por favor, intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    // Aquí puedes implementar la lógica para reenviar el código
    // Por ahora solo mostramos un mensaje
    alert("Código reenviado. Por favor, revisa tu correo electrónico.");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Verifica tu cuenta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Hemos enviado un código de verificación a:{" "}
          <span className="font-medium">{userEmail}</span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="token"
                className="block text-sm font-medium text-gray-700"
              >
                Código de verificación
              </label>
              <div className="mt-1 flex justify-between space-x-2">
                {token.map((digit, index) => (
                  <input
                    key={index}
                    id={`token-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleTokenChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="block w-full text-center px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    autoFocus={index === 0}
                  />
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Ingresa el código de 6 dígitos que recibiste por correo
                electrónico
              </p>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? "Verificando..." : "Verificar cuenta"}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendCode}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                ¿No recibiste el código? Reenviar
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  ¿Problemas para verificar?
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
