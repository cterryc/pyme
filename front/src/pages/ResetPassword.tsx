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
    <div className='flex flex-col min-h-screen'>
      <Header />
      {!resetPassToken ? (
        <div className='flex-1 flex justify-center items-start'>
          {/* <section className='w-full max-w-md p-9 border-1 border-[#ccc] self-start my-15 rounded-md shadow-xl '> */}
          <section className='my-20 w-md'>
            {!isDone ? (
              <form className={`flex flex-col gap-0`} onSubmit={handleSubmit(onSubmit)}>
                <h2 className='text-2xl  text-[var(--font-title-light)] font-medium mb-5'>Recupera tu contraseña</h2>
                <div className='flex flex-col gap-2'>
                  <input
                    type='text'
                    {...register('email', {
                      required: 'El email es obligatorio',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Ingresa un email válido'
                      }
                    })}
                    className='border border-[#ccc] rounded-md p-3 w-full placeholder:text-[#7d7d7e] text-gray-600 outline-none '
                    placeholder='Correo electrónico'
                    // style={{ borderColor: 'red' }}
                  />
                  {errors.email?.message && <p className='text-red-500'>{errors.email?.message.toString()}</p>}
                </div>
                <div className='flex justify-end'>
                  <Link to='/inicio-sesion' className='text-[#0095d5] text-right mt-4 cursor-pointer hover:underline'>
                    Volver al inicio de sesión
                  </Link>
                </div>

                <input
                  type='submit'
                  value='Enviar'
                  disabled={isPending}
                  className='bg-[var(--primary)] py-3 text-white cursor-pointer mt-5 rounded-md hover:bg-[#28a9d6ff] duration-150'
                  style={{ background: isPending ? 'gray' : '' }}
                />
              </form>
            ) : (
              <div className='flex flex-col gap-2'>
                <h3 className='text-2xl font-medium text-[var(--font-title-light)] mb-5'>
                  Su solicitud ha sido enviada
                </h3>
                <p className='text-md mb-5'>Si su correo está registrado, recibirá un correo para continuar.</p>
                <p className='text-[var(--primary)] mb-5 text-center'>¿Aún no recibes el correo electrónico?</p>
                <button
                  onClick={() => {
                    setIsDone(false)
                  }}
                  className='bg-[#0095d5] text-white outline-1 h-10 w-32 rounded-md hover:bg-[#28a9d6] transition-colors cursor-pointer self-center'
                >
                  Reenviar
                </button>
              </div>
            )}
          </section>
        </div>
      ) : (
        <div className='flex-1 content-center'>
          <form className='flex flex-col gap-0 m-auto max-w-md' onSubmit={handleSubmitPass(onSubmitNewPass)}>
            <h2 className='text-2xl  text-[var(--font-title-light)] font-medium mb-5'>Recupera tu contraseña</h2>
            <div className='flex flex-col gap-2'>
              <label>Nueva contraseña</label>
              <input type='text' className='border p-2 border-[#D1D5DB] rounded-md' {...registerPass('password')} />
              {errorsPass.password && <p className='text-red-500'>{errorsPass.password.message}</p>}
            </div>
            <div className='flex flex-col gap-2'>
              <label>Confirme la nueva contraseña</label>
              <input
                type='text'
                {...registerPass('confirmPassword')}
                className='border p-2 border-[#D1D5DB] rounded-md'
              />
              {errorsPass.confirmPassword && <p className='text-red-500'>{errorsPass.confirmPassword.message}</p>}
            </div>

            <input
              type='submit'
              value='Enviar'
              disabled={isPendingPass}
              className='bg-[var(--primary)] px-5 py-3 text-white cursor-pointer mt-5 rounded-md hover:bg-[#28a9d6ff] duration-150'
              style={{ background: isPendingPass ? 'gray' : '' }}
            />
          </form>
        </div>
      )}
      <Footer />
    </div>
  )
}
