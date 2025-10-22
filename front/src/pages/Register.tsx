import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useAuthRegister } from '@/hooks/useAuth'
import { registerSchema, type RegisterFormData } from '@/schemas/auth.schema'
import { toast } from 'sonner'

export const Register = () => {
  // variables
  const [hidePassword, setHidePassword] = useState<boolean>(false)
  // const [hideConfirmPassword, setHideConfirmPassword] = useState<boolean>(false)

  // hooks
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  })
  const {
    mutate: authRegister,
    isPending,
    isError,
    error
  } = useAuthRegister({
    onSuccess: (data) => {
      localStorage.setItem('tokenPyme', data.payload.token)
      console.log('Register successful:', data)
      toast.success('¡Registro exitoso!', {
        style: { borderColor: '#3cbb38ff', backgroundColor: '#f5fff1ff', borderWidth: '2px' },
        description:
          'Tu cuenta ha sido creada. Ahora puedes registrar una MYPE para realizar una solicitud de crédito.',
        duration: 4000
      })
      navigate('/panel')
    },
    onError: (dataError) => {
      toast.error('Error al registrarse', {
        style: { borderColor: '#fa4545ff', backgroundColor: '#fff1f1ff', borderWidth: '2px' },
        description:
          (dataError as any).payload?.message || 'Hubo un problema al crear tu cuenta. Por favor, intenta nuevamente.',
        duration: 4000
      })
    }
  })

  // methods
  const IconEye = hidePassword ? FaEye : FaEyeSlash
  const onSubmit = (data: RegisterFormData) => {
    console.log(data)
    authRegister(data)
  }

  return (
    <div className='min-h-screen flex flex-col'>
      <div className='sticky top-0 z-50'>
        <Header />
      </div>
      <section className='flex-grow flex items-center justify-center'>
        <section className='w-full max-w-md px-4'>
          <div className='flex flex-col items-center text-center'>
            <h3 className='text-3xl font-bold text-black'>Crea tu cuenta</h3>
            <p className='text-[#7d7d7e] text-sm mt-2'>
              No tienes una cuenta?
              <Link to='/inicio-sesion' className='text-[var(--primary)] pl-2 cursor-pointer'>
                Iniciar sesión
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
          <form className={`flex flex-col gap-0 ${!isError && 'mt-6'}`} onSubmit={handleSubmit(onSubmit)}>
            <div className='rounded-t-md border-b-0 border-2 border-gray-300'>
              <input
                type='email'
                {...register('email')}
                placeholder='Correo electrónico'
                name='email'
                className='border-none p-3 w-full placeholder:text-[#7d7d7e] text-gray-600 outline-none'
              />
              {errors.email && <span className='text-red-500 text-xs pl-3'>{errors.email.message}</span>}
            </div>
            <div className='relative  border-b-0 border-2 border-gray-300'>
              <input
                type={hidePassword ? 'text' : 'password'}
                {...register('password')}
                placeholder='Contraseña'
                name='password'
                className='border-none p-3 w-full placeholder:text-[#7d7d7e] text-gray-600 outline-none'
              />
              {errors.password && <span className='text-red-500 text-xs pl-3'>{errors.password.message}</span>}
              <IconEye
                onClick={() => setHidePassword(!hidePassword)}
                className='absolute right-3 top-3.5 text-gray-400 cursor-pointer w-5 h-5'
              />
            </div>
            <div className='relative rounded-b-md border-2 border-gray-300'>
              <input
                type={hidePassword ? 'text' : 'password'}
                {...register('confirmPassword')}
                placeholder='Confirmar contraseña'
                name='confirmPassword'
                className='border-none p-3 w-full placeholder:text-[#7d7d7e] text-gray-600 outline-none'
              />
              {errors.confirmPassword && (
                <span className='text-red-500 text-xs pl-3'>{errors.confirmPassword?.message}</span>
              )}
              {/* <IconEyeConfirm
                onClick={() => setHidePassword(!hidePassword)}
                className='absolute right-3 top-3.5 text-gray-400 cursor-pointer w-5 h-5'
              /> */}
            </div>
            <button
              className='bg-[#0095d5] text-white p-3 rounded-md mt-6 hover:bg-[#28a9d6] transition-colors 
            cursor-pointer'
            >
              {isPending ? 'registrando...' : 'Registrarse'}
            </button>
          </form>
        </section>
      </section>
      <Footer />
    </div>
  )
}
