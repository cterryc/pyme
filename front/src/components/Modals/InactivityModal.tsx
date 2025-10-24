import { decodeToken } from "@/helpers/decodeToken"
import { useEffect, useRef, useState, type ReactNode } from "react"

export const InactivityModal = ({ children }: { children: ReactNode }) => {
  const [toggleModal, setToggleModal] = useState<boolean>(false)
  const [expiredModal, setExpiredModal] = useState<boolean>(false)
  const [countDown, setCountDown] = useState<number>(30)
  const timeRef = useRef<number | null>(null)

  const inactivityTime = 15 * 60 * 1000 // 15 minutes
  const publicRoutes = ["/", "/Login", "/Registro"];

  const resetTimer = () => {
    if (publicRoutes.includes(location.pathname)) return;
    if (timeRef.current) clearTimeout(timeRef.current)
    timeRef.current = window.setTimeout(() => setToggleModal(true), inactivityTime)
  }

  const continueSession = () => {
    setToggleModal(false)
    resetTimer()
  }
  const closeSession = () => {
    localStorage.removeItem('tokenPyme')
    window.location.href = '/inicio-sesion'
    setToggleModal(false)
  }

  const checkExpiredToken = () => {
    if (publicRoutes.includes(location.pathname)) return;
    const token = localStorage.getItem("tokenPyme")
    const user = decodeToken(token || "")
    if (typeof user === "string" && user === "expired token") {
      setExpiredModal(true)
    }
  }

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']
    events.forEach(event => window.addEventListener(event, resetTimer))
    resetTimer()

    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer))
      if (timeRef.current) clearTimeout(timeRef.current)
    }
  }, [])

  useEffect(() => {
    if (!toggleModal) return;

    setCountDown(30);
    const interval = setInterval(() => {
      setCountDown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          closeSession();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [toggleModal]);

  useEffect(() => {
    const interval = setInterval(checkExpiredToken, 30000)
    checkExpiredToken() // chequea una vez al iniciar

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {children}
      {toggleModal && !expiredModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full text-center">
            <p className="text-xl font-semibold">¿Sigues ahí?</p>
            <p className="text-lg mb-6">
              Tu sesión se cerrará automáticamente en <span className="font-bold">{countDown}</span> segundos.
              ¿Deseas continuar en la web?
            </p>
            <div className="flex justify-center gap-2 text-white">
              <button
                onClick={closeSession}
                className="cursor-pointer bg-[#c24949] hover:bg-[#c95353] rounded-lg px-4 py-2 w-full"
              >
                Cerrar Sesion
              </button>
              <button
                onClick={continueSession}
                className="cursor-pointer bg-[#0095d5] hover:bg-[#28a9d6] rounded-lg px-4 py-2 w-full"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}
      {expiredModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full text-center">
            <p className="text-xl font-semibold mb-4">Sesión expirada</p>
            <p className="text-gray-600 mb-6">
              Tu sesión ha expirado por seguridad. Por favor, vuelve a iniciar sesión para continuar.
            </p>
            <button
              onClick={closeSession}
              className="bg-[#c24949] hover:bg-[#c95353] text-white rounded-lg px-4 py-2 w-full"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </>
  )
}
