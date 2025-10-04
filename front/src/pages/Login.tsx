import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Header } from "@/components/Header"
import { loginSchema, type LoginFormData } from "@/schemas/auth.schema";
import { useAuthLogin } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })
  const { mutate: login } = useAuthLogin({
    onSuccess: (data) => {
      console.log("Login successful:", data);
      navigate('/')
    }
  })

  const onSubmit = (data: LoginFormData) => {
    login(data)
  }
  return (
    <div className="min-h-screen flex flex-col">
      <div className="sticky top-0 z-50"><Header avatar="IniciarSesion" /></div>
      <section className="flex-grow flex items-center justify-center">
        <section className="w-full max-w-md px-4">
          <div className="flex flex-col items-center text-center">
            <h3 className="text-3xl font-bold text-black">Inicia sesión en tu cuenta</h3>
            <p className="text-[#7d7d7e] text-sm mt-2">
              No tienes una cuenta?
              <span onClick={() => navigate('/Registro')} className="text-[#0095d5] pl-2 cursor-pointer">Regístrate</span>
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-0">
            <div className="rounded-t-md border-b-0 border-2 border-gray-300">
              <input
                type="text"
                {...register("email")}
                className="border-none p-3 w-full placeholder:text-[#7d7d7e] text-gray-600 outline-none"
                placeholder="Correo electrónico"
              />
              {errors.email && <span className="text-red-500 text-xs pl-3">{errors.email.message}</span>}
            </div>
            <div className="rounded-b-md border-2 border-gray-300">
              <input
                type="password"
                {...register("password")}
                className="border-none p-3 w-full placeholder:text-[#7d7d7e] text-gray-600 outline-none"
                placeholder="Contraseña"
              />
              {errors.password && <span className="text-red-500 text-xs pl-3">{errors.password.message}</span>}
            </div>
            <p className="text-[#0095d5] text-right mt-4 cursor-pointer">Olvidaste tu contraseña?</p>
            <button className="bg-[#0095d5] text-white p-3 rounded-md mt-6 hover:bg-[#28a9d6] transition-colors cursor-pointer">
              Iniciar Sesión
            </button>
          </form>
        </section>
      </section>
    </div>
  )
}