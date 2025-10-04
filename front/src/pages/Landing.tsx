import { HiOutlineTrendingUp, HiOutlineCalendar, HiOutlineCash, HiOutlineClipboardList } from 'react-icons/hi'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Link } from 'react-router-dom'
export const Landing = () => {
  const avatarTemp = ''
  // const avatarTemp = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaotZTcu1CLMGOJMDl-f_LYBECs7tqwhgpXA&s'

  return (
    <>
      <Header avatar={avatarTemp} />
      <section
        className={`min-h-[50vh] p-5 overflow-hidden bg-center bg-[url("assets/landing/portada.jpeg")] flex flex-col justify-around text-white text-center`}
      >
        <div className='max-w-200 w-full mx-auto'>
          <p className='text-3xl md:text-6xl font-bold mb-6'>Impulsa tu negocio con el crédito ideal</p>
          <p className='text-xl md:text-3xl'>
            En Financia, entendemos las necesidades de las PYMES. Ofrecemos soluciones de financiamiento flexible y
            adaptadas a tu crecimiento.
          </p>
        </div>
        <Link
          to='/'
          className='bg-[var(--primary)] mx-auto  border-1 border-[var(--primary)] px-4 py-2 rounded-md hover:bg-white hover:text-[var(--primary)] hover:font-medium cursor-pointer'
        >
          Descubre tu crédito
        </Link>
      </section>
      <section className='max-w-7xl m-auto my-25 p-5'>
        <h2 className='text-center font-medium text-3xl mb-20 text-[var(--font-title-light)]'>
          Nuestros productos de crédito
        </h2>
        <div className='flex flex-col md:flex-row gap-6 justify-around items-center'>
          <article className=' max-w-xs bg-[#F6F7F8] shadow-xl border border-[#C9C9C9] rounded-xl overflow-hidden text-sm flex flex-col hover:scale-[1.1] duration-150 cursor-pointer'>
            <div className=' pt-3 pb-8 px-5'>
              <h3 className='text-2xl my-2 text-[var(--font-title-light)] font-medium'>Crédito Express</h3>
              <p className='text-xs'>
                Accede rápidamente a financiamiento para cubrir necesidades inmediatas de tu negocio.
              </p>
            </div>
            <ul className='p-4 text-md flex flex-col gap-5 bg-white'>
              <li className='flex'>
                <HiOutlineCash className='text-[var(--primary)] inline mr-3 text-xl' />
                <p>
                  <strong>Monto:</strong> Hasta $50.000
                </p>
              </li>
              <li className='flex'>
                <HiOutlineCalendar className='text-[var(--primary)] inline mr-3 text-xl' />
                <p>
                  <strong>Plazo:</strong> Hasta 2 años
                </p>
              </li>
              <li className='flex'>
                <HiOutlineTrendingUp className='text-[var(--primary)] inline mr-3 text-xl' />
                <p>
                  <strong>Taza:</strong> Desde 12%
                </p>
              </li>
              <li className='flex'>
                <HiOutlineClipboardList className='text-[var(--primary)] inline mr-3 text-2xl' />
                <p>
                  <strong className=''>Requisitos: </strong>
                  Ingresos anuales superiores a $100.000
                </p>
              </li>
            </ul>

            <Link
              to='/'
              className='bg-[var(--primary)] hover:bg-transparent hover:text-[var(--primary)] hover:border-1  border self-center p-3 text-white font-medium rounded-md w-70 text-center my-7'
            >
              Solicitar ahora
            </Link>
          </article>
          <article className='relative max-w-xs bg-[#F6F7F8] shadow-xl border-2 border-[var(--primary)] rounded-xl overflow-hidden text-sm flex flex-col before:content-["Más_popular"]  before:absolute before:top-[0px] before:right-[0px] before:px-3 before:p-1 before:rounded-bl-xl before:text-xs before:bg-[var(--primary)] before:text-white hover:scale-[1.1] duration-150 cursor-pointer'>
            <div className=' pt-3 pb-8 px-5'>
              <h3 className='text-2xl my-2 text-[var(--font-title-light)] font-medium'>Crédito para Expansión</h3>
              <p className='text-xs'>
                Invierte en el crecimiento de tu empresa con un crédito a largo plazo y condiciones favorables.
              </p>
            </div>
            <ul className='p-4 text-md flex flex-col gap-5 bg-white'>
              <li className='flex'>
                <HiOutlineCash className='text-[var(--primary)] inline mr-3 text-xl' />
                <p>
                  <strong>Monto:</strong> Hasta $200.000
                </p>
              </li>
              <li className='flex'>
                <HiOutlineCalendar className='text-[var(--primary)] inline mr-3 text-xl' />
                <p>
                  <strong>Plazo:</strong> Hasta 5 años
                </p>
              </li>
              <li className='flex'>
                <HiOutlineTrendingUp className='text-[var(--primary)] inline mr-3 text-xl' />
                <p>
                  <strong>Taza:</strong> Desde 10%
                </p>
              </li>
              <li className='flex'>
                <HiOutlineClipboardList className='text-[var(--primary)] inline mr-3 text-3xl' />
                <p>
                  <strong className=''>Requisitos: </strong>
                  Ingresos anuales superiores a $250.000, plan de negocio.
                </p>
              </li>
            </ul>

            <Link
              to='/'
              className='bg-[var(--primary)] hover:bg-transparent hover:text-[var(--primary)] hover:border-1  border self-center p-3 text-white font-medium rounded-md w-70 text-center my-7'
            >
              Solicitar ahora
            </Link>
          </article>
          <article className='max-w-xs bg-[#F6F7F8] shadow-xl border border-[#C9C9C9] rounded-xl overflow-hidden text-sm flex flex-col hover:scale-[1.1] duration-150 cursor-pointer'>
            <div className=' pt-3 pb-8 px-5'>
              <h3 className='text-2xl my-2 text-[var(--font-title-light)] font-medium'>Capital de Trabajo</h3>
              <p className='text-xs'>
                Mantén la operatividad de tu negocio con un crédito flexible para cubrir gastos corrientes.
              </p>
            </div>
            <ul className='p-4 text-md flex flex-col gap-5 bg-white'>
              <li className='flex'>
                <HiOutlineCash className='text-[var(--primary)] inline mr-3 text-xl' />
                <p>
                  <strong>Monto:</strong> Hasta $100.000
                </p>
              </li>
              <li className='flex'>
                <HiOutlineCalendar className='text-[var(--primary)] inline mr-3 text-xl' />
                <p>
                  <strong>Plazo:</strong> Hasta 3 años
                </p>
              </li>
              <li className='flex'>
                <HiOutlineTrendingUp className='text-[var(--primary)] inline mr-3 text-xl' />
                <p>
                  <strong>Taza:</strong> Desde 14%
                </p>
              </li>
              <li className='flex'>
                <HiOutlineClipboardList className='text-[var(--primary)] inline mr-3 text-2xl' />
                <p>
                  <strong className=''>Requisitos: </strong>
                  Ingresos anuales superiores a $150.000
                </p>
              </li>
            </ul>

            <Link
              to='/'
              className='bg-[var(--primary)] hover:bg-transparent hover:text-[var(--primary)] hover:border-1  border self-center p-3 text-white font-medium rounded-md w-70 text-center my-7'
            >
              Solicitar ahora
            </Link>
          </article>
        </div>
      </section>

      <section className='max-w-7xl p-5 m-auto my-25 flex flex-col gap-15 text-center items-center'>
        <h2 className='text-center font-medium text-3xl text-[var(--font-title-light)]'>
          ¿No estás seguro de cuál elegir?
        </h2>
        <p className='text-xl max-w-250'>
          Utiliza nuestra herramienta de comparación para encontrar el crédito que mejor se adapte a las necesidades
          específicas de tu empresa.
        </p>
        <Link
          to='/'
          className='bg-[var(--primary)] border border-[var(--primary)] mx-auto text-white px-4 py-2 rounded-md hover:bg-white hover:text-[var(--primary)] hover:font-medium cursor-pointer'
        >
          Comparar créditos
        </Link>
      </section>
      <Footer />
    </>
  )
}
