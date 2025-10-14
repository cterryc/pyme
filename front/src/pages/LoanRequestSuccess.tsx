import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { MdOutlineCheck } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

export const LoanRequestSuccess = () => {
  const navigate = useNavigate()
  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <section className='flex-1 flex justify-center items-center'>
        <div className='flex flex-col items-center justify-center max-w-xl gap-7 '>
          <div className='bg-[#b5d9ed] text-4xl text-[var(--primary)] px-4 py-5 border-15 border-[#dfecf4] rounded-full '>
            <MdOutlineCheck />
          </div>
          <h2 className='text-2xl font-medium text-[var(--font-title-light)]'>¡Solicitud Enviada!</h2>
          <p className='text-center'>
            Hemos recibido tu solicitud de crédito. Nuestro equipo la está revisando y nos pondremos en contacto contigo
            muy pronto
          </p>
          <div className='bg-white w-full border-1 border-[#ddd] gap-6 rounded-md flex flex-col p-5'>
            <h3 className='text-xl font-medium text-[var(--font-title-light)]'>Detalles de la solicitud</h3>
            <div className='flex justify-between items-center border-b-1 border-[#ccc] pb-5'>
              <p>Numero de referencia</p>
              <p className='font-medium text-[var(--font-title-light)]'>63df8260-3860-429a-b286-b104ca25452f</p>
            </div>
            <div className='flex justify-between items-center'>
              <p>Monto solicitado</p>
              <p className='font-medium text-[var(--font-title-light)]'>$5000</p>
            </div>
            <div className='flex justify-between items-center'>
              <p>Pago en</p>
              <p className='font-medium text-[var(--font-title-light)]'>12 cuotas</p>
            </div>
          </div>
          <button
            onClick={() => {
              navigate('/Dashboard')
            }}
            className='bg-[var(--primary)] text-white px-5 py-3 rounded-md cursor-pointer hover:bg-[#10638d] duration-150 '
          >
            Volvr al inicio
          </button>
        </div>
      </section>
      <Footer />
    </div>
  )
}
