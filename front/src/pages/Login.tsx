import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { zodResolver } from '@hookform/resolvers/zod'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useAuthLogin } from '@/hooks/useAuth'
import { loginSchema, type LoginFormData } from '@/schemas/auth.schema'
import { toast } from 'sonner'

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
      localStorage.setItem('tokenPyme', data.payload.token)
      console.log('Login successful:', data)
      toast.success('¡Bienvenido de nuevo!', {
        style: { borderColor: '#3cbb38ff', backgroundColor: '#f5fff1ff', borderWidth: '2px' },
        description: 'Has iniciado sesión correctamente. Accede a tu panel de gestión.',
        duration: 3000
      })
      navigate('/Dashboard')
    },
    onError: (dataError) => {
      toast.error('Error al iniciar sesión', {
        style: { borderColor: '#fa4545ff', backgroundColor: '#fff1f1ff', borderWidth: '2px' },
        description: (dataError as any).payload?.message || 'Credenciales incorrectas. Verifica tu correo y contraseña.',
        duration: 4000
      })
    }
  })

  // methods
  const IconEye = hidePassword ? FaEye : FaEyeSlash
  const onSubmit = (data: LoginFormData) => {
    //console.log(data)
    login(data)
  }

  return (
    <div className='min-h-screen flex flex-col'>
      <div className='sticky top-0 z-50'>
        <Header />
      </div>
      <section className='flex-grow flex items-center justify-center'>
        <section className='w-full max-w-md px-4'>
          <div className='flex flex-col items-center text-center'>
            <h3 className='text-3xl font-bold text-black'>Inicia sesión en tu cuenta</h3>
            <p className='text-[#7d7d7e] text-sm mt-2'>
              No tienes una cuenta?
              <Link to='/Registro' className='text-[#0095d5] pl-2 cursor-pointer'>
                Regístrate
              </Link>
            </p>
          </div>
          {isError &&
            error?.payload &&
            (Array.isArray(error.payload) ? (
              <ul className='text-red-500 text-xs my-2'>
                {error.payload.map((err, i) => (
                  <li key={i}>Error: {err.message}</li>
                ))}
              </ul>
            ) : (
              <p className='text-red-500 text-xs my-2'>Error: {error.payload.message}</p>
            ))}
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
            <Link to='/ResetPassword' className='text-[#0095d5] text-right mt-4 cursor-pointer hover:underline'>
              Olvidaste tu contraseña?
            </Link>
            <button
              className='bg-[#0095d5] text-white p-3 rounded-md mt-6 hover:bg-[#28a9d6] transition-colors 
            cursor-pointer'
            >
              {isPending ? 'logueando...' : 'Iniciar Sesión'}
            </button>
          </form>
        </section>
      </section>
      <Footer />
    </div>
  )
}
