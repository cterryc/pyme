import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { zodResolver } from '@hookform/resolvers/zod'
import { Header } from '@/components/Header'
import { useAuthLogin } from '@/hooks/useAuth'
import { loginSchema, type LoginFormData } from '@/schemas/auth.schema'

export const Login = () => {
  // variables
  const [hidePassword, setHidePassword] = useState<boolean>(false)

  // hooks
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })
  const {
    mutate: login,
    isPending,
    isError,
    error
  } = useAuthLogin({
    onSuccess: (data) => {
      console.log('Login successful:', data)
      navigate('/')
    }
  })

  // methods
  const IconEye = hidePassword ? FaEye : FaEyeSlash
  const onSubmit = (data: LoginFormData) => {
    // console.log(data)
    login(data)
  }

  return (
    <div className='min-h-screen flex flex-col'>
      <div className='sticky top-0 z-50'>
        <Header avatar='IniciarSesion' />
      </div>
      <section className='flex-grow flex items-center justify-center'>
        <section className='w-full max-w-md px-4'>
          <div className='flex flex-col items-center text-center'>
            <h3 className='text-3xl font-bold text-black'>Inicia sesión en tu cuenta</h3>
            <p className='text-[#7d7d7e] text-sm mt-2'>
              No tienes una cuenta?
              <span onClick={() => navigate('/Registro')} className='text-[#0095d5] pl-2 cursor-pointer'>
                Regístrate
              </span>
            </p>
          </div>
          {isError && <p className='text-red-500 text-xs my-2'>Error: {error.message}</p>}
          <form onSubmit={handleSubmit(onSubmit)} className={`flex flex-col gap-0 ${!isError && 'mt-6'}`}>
            <div className='rounded-t-md border-b-0 border-2 border-gray-300'>
              <input
                type='email'
                {...register('email')}
                className='border-none p-3 w-full placeholder:text-[#7d7d7e] text-gray-600 outline-none'
                placeholder='Correo electrónico'
              />
              {errors.email && <span className='text-red-500 text-xs pl-3'>{errors.email.message}</span>}
            </div>
            <div className='relative rounded-b-md border-2 border-gray-300'>
              <input
                type={hidePassword ? 'text' : 'password'}
                {...register('password')}
                className='border-none p-3 w-full placeholder:text-[#7d7d7e] text-gray-600 outline-none'
                placeholder='Contraseña'
              />
              {errors.password && <span className='text-red-500 text-xs pl-3'>{errors.password.message}</span>}
              <IconEye
                onClick={() => setHidePassword(!hidePassword)}
                className='absolute right-3 top-3.5 text-gray-400 cursor-pointer w-5 h-5'
              />
            </div>
            <p className='text-[#0095d5] text-right mt-4 cursor-pointer'>Olvidaste tu contraseña?</p>
            <button className='bg-[#0095d5] text-white p-3 rounded-md mt-6 hover:bg-[#28a9d6] transition-colors cursor-pointer'>
              {isPending ? 'logueando...' : 'Iniciar Sesión'}
            </button>
          </form>
        </section>
      </section>
    </div>
  )
}
