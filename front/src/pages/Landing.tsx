import { Link } from 'react-router-dom'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useUserAuthenticate } from '@/hooks/useUser'

export const Landing = () => {
  const { hasUser } = useUserAuthenticate()

  const steps = [
    {
      title: 'Registra tu Pyme',
      text: 'Completa un formulario dinámico con los datos de tu negocio y los documentos requeridos. En pocos minutos tendrás tu cuenta lista para operar.'
    },
    {
      title: 'Solicita tu crédito',
      text: 'Desde tu panel Pyme, envía la solicitud indicando el monto que necesitas y el motivo del préstamo.'
    },
    {
      title: 'Revisa y confirma tu plan',
      text: 'Verifica el monto final, las cuotas disponibles y el cronograma de pagos antes de confirmar tu solicitud.'
    },
    {
      title: 'Recibe tu crédito y sigue creciendo',
      text: 'Una vez aprobado, el dinero se transfiere directamente a tu cuenta Pyme. ¡Empieza a invertir en tu crecimiento!'
    }
  ]

  return (
    <>
      <Header />
      <section
        className={`min-h-[500px] p-5 overflow-hidden bg-center flex flex-col justify-around text-white text-center`}
        style={{ backgroundImage: `url("assets/landing/portada.jpeg")` }}
      >
        <div className='max-w-200 w-full mx-auto flex flex-col gap-8'>
          <p className='text-3xl md:text-6xl font-bold'>Impulsa tu negocio con el crédito ideal</p>
          <p className='text-2xl'>
            En Financia, entendemos las necesidades de las PYMES. Ofrecemos soluciones de financiamiento flexible y
            adaptadas a tu crecimiento.
          </p>
          <Link
            to={hasUser ? '/Dashboard' : '/Login'}
            className='bg-[#0095d5] text-white flex items-center w-fit mx-auto px-6 py-3 rounded-md hover:bg-[#28a9d6] transition-colors cursor-pointer'
          >
            Solicita tu crédito
          </Link>
        </div>
      </section>
      <section className='max-w-5xl m-auto my-16'>
        <h2 className='text-4xl font-bold text-center mb-12'>Solicita tu crédito en 4 simples pasos</h2>
        <section className='flex flex-col gap-10'>
          {steps.map((step, index) => (
            <div key={index} className='flex gap-7 items-start'>
              <p className='text-7xl font-bold text-[#0095d5]'>{index + 1}</p>
              <div className='flex flex-col gap-2'>
                <h3 className='text-2xl font-semibold'>{step.title}</h3>
                <p className='text-gray-600'>{step.text}</p>
              </div>
            </div>
          ))}
        </section>
      </section>
      <Footer />
    </>
  )
}
