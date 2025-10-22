import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { MdOutlineCheck } from 'react-icons/md'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { formatToDolar } from '@/helpers/formatToDolar'
import Confetti from 'react-confetti'

export const LoanRequestSuccess = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Obtener todos los parámetros
  const refNum = searchParams.get('refNum')
  const legalName = searchParams.get('legalName')
  const interest = searchParams.get('interest')
  const amount = searchParams.get('amount')
  const months = searchParams.get('months')

  return (
    <div className='min-h-screen flex flex-col'>
      <Confetti recycle={false} numberOfPieces={500} />
      <Header />
      <section className='flex-1 flex justify-center items-center py-5'>
        <div className='flex flex-col items-center justify-center max-w-xl gap-7 '>
          <div className='bg-[#b5d9ed] text-4xl text-[var(--primary)] px-4 py-5 border-15 border-[#dfecf4] rounded-full '>
            <MdOutlineCheck />
          </div>
          <h2 className='text-2xl font-medium text-[var(--font-title-light)]'>¡Solicitud Enviada!</h2>
          <p className='text-center'>
            Hemos recibido tu solicitud de crédito. Nuestro equipo la está revisando y nos pondremos en contacto contigo
            muy pronto
          </p>
          <div className='bg-white w-full border-1 border-[#ddd] gap-3 rounded-md flex flex-col p-5'>
            <h3 className='text-xl font-medium text-[var(--font-title-light)]'>Detalles de la solicitud</h3>
            <div className='flex justify-between items-center border-b-1 border-[#ccc] pb-5'>
              <p>Numero de referencia</p>
              <p className='font-medium text-[var(--font-title-light)]'>{refNum}</p>
            </div>
            <div className='flex justify-between items-center'>
              <p>Empresa</p>
              <p className='font-medium text-[var(--font-title-light)]'>{legalName}</p>
            </div>
            <div className='flex justify-between items-center'>
              <p>Monto solicitado</p>
              <p className='font-medium text-[var(--font-title-light)]'>{formatToDolar(Number(amount))}</p>
            </div>
            <div className='flex justify-between items-center'>
              <p>Pago en</p>
              <p className='font-medium text-[var(--font-title-light)]'>{months} cuotas</p>
            </div>
            <div className='flex justify-between items-center'>
              <p>Interes</p>
              <p className='font-medium text-[var(--font-title-light)]'>{interest} %</p>
            </div>
            <div className='flex justify-between items-center'>
              <p>Monto por cuota:</p>
              <p className='font-medium text-[var(--font-title-light)]'>
                {formatToDolar((Number(amount) * (1 + Number(interest) / 100)) / Number(months))}
              </p>
            </div>

            <div className='flex justify-between items-center text-lg font-medium  py-3 border-t-1 border-[#ccc]'>
              <p>Total:</p>
              <p className='font-medium text-[var(--primary)]'>
                {formatToDolar(Number(amount) * (1 + Number(interest) / 100))}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              navigate('/panel')
            }}
            className='bg-[var(--primary)] text-white px-5 py-3 rounded-md cursor-pointer hover:bg-[#10638d] duration-150 '
          >
            Volver al inicio
          </button>
        </div>
      </section>
      <Footer />
    </div>
  )
}
