import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useResetPasword, useResetPaswordEmail } from '@/hooks/useAuth'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { resetPasswordSchema, type ResetPasswordFormData } from '@/schemas/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'

interface FormData {
  email: string
}

export const ResetPasword = () => {
  const [searchParams] = useSearchParams()
  const [resetPassToken, setResetPassToken] = useState<null | string>()
  const [isDone, setIsDone] = useState(false)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>()

  const {
    register: registerPass,
    handleSubmit: handleSubmitPass,
    formState: { errors: errorsPass }
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange'
  })

  const {
    mutate: sendResetPasswordEmail,
    isPending
    // isError,
    // error
  } = useResetPaswordEmail({
    onSuccess: () => {
      setIsDone(true)
    },
    onError: () => {
      toast.error('Error', {
        style: { borderColor: '#fa4545ff', backgroundColor: '#fff1f1ff', borderWidth: '2px' },
        description: 'No se pudo enviar el correo electrónico, vuelva a intentar',
        duration: 4000
      })
    }
  })

  const {
    mutate: sendResetPassword,
    isPending: isPendingPass
    // isError,
    // error
  } = useResetPasword({
    onSuccess: () => {
      toast.success('¡Hecho!. Su contraseña ha sido actualizada exitosamente', {
        style: { borderColor: '#3cbb38ff', backgroundColor: '#f5fff1ff', borderWidth: '2px' },
        description: 'Ahora inicie sesión.',
        duration: 4000
      })
      navigate('/inicio-sesion')
    },
    onError: () => {
      toast.error('Error', {
        style: { borderColor: '#fa4545ff', backgroundColor: '#fff1f1ff', borderWidth: '2px' },
        description: 'No se actualizar su contraseña, vuelva a intentar',
        duration: 4000
      })
    }
  })

  useEffect(() => {
    const resetPassToken = searchParams.get('token')
    setResetPassToken(resetPassToken)
  }, [searchParams])

  const onSubmit = (data: FormData) => {
    sendResetPasswordEmail(data)
  }

  const onSubmitNewPass = (data: ResetPasswordFormData) => {
    sendResetPassword({ token: resetPassToken || '', password: data.password, newPassword: data.confirmPassword })
  }

  return (
    <div className='flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-blue-50'>
      <Header />
      {!resetPassToken ? (
        <div className='flex-1 flex justify-center items-center px-4 py-12'>
          <section className='w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100'>
            {!isDone ? (
              <form className='flex flex-col gap-5' onSubmit={handleSubmit(onSubmit)}>
                <div className='text-center mb-2'>
                  <h2 className='text-3xl text-[var(--font-title-light)] font-semibold mb-2'>
                    Recupera tu contraseña
                  </h2>
                  <p className='text-gray-600 text-sm'>
                    Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
                  </p>
                </div>
                
                <div className='flex flex-col gap-2'>
                  <label htmlFor='email' className='text-sm font-medium text-gray-700'>
                    Correo electrónico
                  </label>
                  <input
                    id='email'
                    type='email'
                    {...register('email', {
                      required: 'El email es obligatorio',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Ingresa un email válido'
                      }
                    })}
                    className={`border ${errors.email ? 'border-red-400 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'} rounded-lg p-3 w-full placeholder:text-gray-400 text-gray-700 outline-none focus:ring-2 focus:border-transparent transition-all`}
                    placeholder='correo@ejemplo.com'
                  />
                  {errors.email?.message && (
                    <p className='text-red-500 text-sm flex items-center gap-1'>
                      <span>⚠</span> {errors.email?.message.toString()}
                    </p>
                  )}
                </div>
                
                <div className='flex justify-end'>
                  <Link 
                    to='/inicio-sesion' 
                    className='text-[var(--primary)] text-sm font-medium hover:underline hover:text-[#28a9d6ff] transition-colors'
                  >
                    ← Volver al inicio de sesión
                  </Link>
                </div>

                <button
                  type='submit'
                  disabled={isPending}
                  className='bg-[var(--primary)] py-3 px-6 text-white font-medium cursor-pointer rounded-lg hover:bg-[#28a9d6ff] disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-150 shadow-md hover:shadow-lg'
                >
                  {isPending ? 'Enviando...' : 'Enviar enlace de recuperación'}
                </button>
              </form>
            ) : (
              <div className='flex flex-col gap-6 text-center'>
                <div className='mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2'>
                  <span className='text-3xl'>✓</span>
                </div>
                <h3 className='text-2xl font-semibold text-[var(--font-title-light)]'>
                  Solicitud enviada
                </h3>
                <p className='text-gray-600 leading-relaxed'>
                  Si tu correo está registrado, recibirás un enlace para restablecer tu contraseña en los próximos minutos.
                </p>
                <p className='text-sm text-gray-500'>
                  Revisa tu bandeja de entrada y la carpeta de spam.
                </p>
                <div className='border-t border-gray-200 pt-6 mt-2'>
                  <p className='text-[var(--primary)] font-medium mb-4'>¿Aún no recibes el correo electrónico?</p>
                  <button
                    onClick={() => {
                      setIsDone(false)
                    }}
                    className='bg-[var(--primary)] text-white font-medium px-6 py-3 rounded-lg hover:bg-[#28a9d6ff] transition-all duration-150 shadow-md hover:shadow-lg'
                  >
                    Reenviar correo
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      ) : (
        <div className='flex-1 flex justify-center items-center px-4 py-12'>
          <form 
            className='flex flex-col gap-6 w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100' 
            onSubmit={handleSubmitPass(onSubmitNewPass)}
          >
            <div className='text-center mb-2'>
              <h2 className='text-3xl text-[var(--font-title-light)] font-semibold mb-2'>
                Nueva contraseña
              </h2>
              <p className='text-gray-600 text-sm'>
                Ingresa tu nueva contraseña para completar el proceso
              </p>
            </div>
            
            <div className='flex flex-col gap-2'>
              <label htmlFor='password' className='text-sm font-medium text-gray-700'>
                Nueva contraseña
              </label>
              <input 
                id='password'
                type='password' 
                className={`border ${errorsPass.password ? 'border-red-400 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'} p-3 rounded-lg outline-none focus:ring-2 focus:border-transparent transition-all text-gray-700`}
                {...registerPass('password')} 
                placeholder='Mínimo 8 caracteres'
              />
              {errorsPass.password && (
                <p className='text-red-500 text-sm flex items-center gap-1'>
                  <span>⚠</span> {errorsPass.password.message}
                </p>
              )}
            </div>
            
            <div className='flex flex-col gap-2'>
              <label htmlFor='confirmPassword' className='text-sm font-medium text-gray-700'>
                Confirmar nueva contraseña
              </label>
              <input
                id='confirmPassword'
                type='password'
                {...registerPass('confirmPassword')}
                className={`border ${errorsPass.confirmPassword ? 'border-red-400 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'} p-3 rounded-lg outline-none focus:ring-2 focus:border-transparent transition-all text-gray-700`}
                placeholder='Repite la contraseña'
              />
              {errorsPass.confirmPassword && (
                <p className='text-red-500 text-sm flex items-center gap-1'>
                  <span>⚠</span> {errorsPass.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type='submit'
              disabled={isPendingPass}
              className='bg-[var(--primary)] px-6 py-3 text-white font-medium cursor-pointer rounded-lg hover:bg-[#28a9d6ff] disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-150 shadow-md hover:shadow-lg mt-2'
            >
              {isPendingPass ? 'Actualizando...' : 'Restablecer contraseña'}
            </button>
          </form>
        </div>
      )}
      <Footer />
    </div>
  )
}
