import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Link, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useResetPasword } from '@/hooks/useAuth'
import { useState } from 'react'

interface FormData {
  email: string
}
export const ResetPasword = () => {
  const [searchParams] = useSearchParams()
  const [isDone, setIsDone] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>()

  const {
    mutate: sendResetPassword,
    isPending
    // isError,
    // error
  } = useResetPasword({
    onSuccess: (data) => {
      console.log(data)
      setIsDone(true)
    },
    onError: (error) => {
      console.log('ERROR : ', error)
    }
  })

  const tokenResetPass = searchParams.get('token')
  console.log(tokenResetPass)

  const onSubmit = (data: FormData) => {
    sendResetPassword(data)
  }

  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
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
              <h3 className='text-2xl font-medium text-[var(--font-title-light)] mb-5'>Su solicitud ha sido enviada</h3>
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
      <Footer />
    </div>
  )
}
