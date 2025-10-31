import { MdOutlineCheck } from 'react-icons/md'
import { BiErrorAlt } from 'react-icons/bi'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Confetti from 'react-confetti'

export const SignRecived = () => {
  const [searchParams] = useSearchParams()
  const success = searchParams.get('success')
  const navigate = useNavigate()

  if (success === 'true') {
    return (
      <div className='flex flex-col '>
        <Confetti recycle={false} />
        <section className='flex-1 flex justify-center items-center py-5'>
          <div className='flex flex-col items-center justify-center max-w-xl gap-7 h-100'>
            <div className='bg-[#b5d9ed] text-4xl text-[var(--primary)] px-4 py-5 border-15 border-[#dfecf4] rounded-full '>
              <MdOutlineCheck />
            </div>
            <h2 className='text-2xl font-medium text-[var(--font-title-light)]'>Firma recibida!</h2>
            <p className='text-center'>
              Hemos recibido la firma del contrato desde SecureID, pronto te contactaremos con los próximos pasos
            </p>
          </div>
        </section>
        <button
          className='px-3 py-3 self-center bg-blue-500 hover:bg-blue-600  text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer whitespace-nowrap'
          onClick={() => {
            navigate('/panel')
          }}
        >
          Volver al panel
        </button>
      </div>
    )
  } else {
    return (
      <div className='flex flex-col '>
        <section className='flex-1 flex justify-center items-center py-5'>
          <div className='flex flex-col items-center justify-center max-w-xl gap-7 h-100'>
            <div className='bg-[#edb5b5] text-4xl text-red-500 px-4 py-5 border-15 border-[#f4dfdf] rounded-full '>
              <BiErrorAlt />
            </div>
            <h2 className='text-2xl font-medium text-[var(--font-title-light)]'>Hubo un error.</h2>
            <p className='text-center'>
              No hemos logrado recuperar tu firma actualment, aunque SecureID si pudo completar el proceso.
              <p className='text-center'>Esto no puede ralentizar ligeramente el proceso.</p>
            </p>
          </div>
        </section>
        <button
          className='px-3 py-3 self-center bg-blue-500 hover:bg-blue-600  text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer whitespace-nowrap'
          onClick={() => {
            navigate('/panel')
          }}
        >
          Volver al panel
        </button>
      </div>
    )
  }
}
