import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Link } from 'react-router-dom'

export const ResetPasword = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <h1 className='text-red-500  text-3xl text-center '>Falta implementar endpoints en backend :( </h1>
      <div className='flex-1 flex justify-center items-center'>
        <section className='w-full max-w-md p-9 border-1 border-[#ccc] rounded-md shadow-xl '>
          <form className={`flex flex-col gap-0`}>
            <h2 className='text-2xl  text-[var(--font-title-light)] font-medium mb-5'>Recupera tu contraseña</h2>
            <div className='flex flex-col gap-2'>
              <input
                type='email'
                className='border border-[#ccc] rounded-md p-3 w-full placeholder:text-[#7d7d7e] text-gray-600 outline-none '
                placeholder='Correo electrónico'
                // style={{ borderColor: 'red' }}
              />
              {/* <p className='text-red-500'>mensaje error genérico</p> */}
            </div>
            <div className='flex justify-end'>
              <Link to='/login' className='text-[#0095d5] text-right mt-4 cursor-pointer hover:underline'>
                Volver al inicio de sesión
              </Link>
            </div>

            <input
              type='submit'
              value='Enviar'
              className='bg-[var(--primary)] py-3 text-white cursor-pointer mt-5 rounded-md hover:bg-[#28a9d6ff] duration-150'
            />
          </form>
        </section>
      </div>
      <Footer />
    </div>
  )
}
