import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
export const UserDashboard = () => {
  return (
    <>
      <Header avatar='/assets/defaultAvatar.jpg' />
      <h1 className='text-5xl my-5'>Dashboard (idea)</h1>

      <div className='flex max-w-7xl m-auto gap-3 min-h-[80vh]'>
        <aside className='border w-xs'>
          <ul>
            <li>Mi perfil</li>
            <li>Mis empresas</li>
            <li>Mis solicitudes</li>
            <li>Mis pagos</li>
          </ul>
        </aside>
        <section className='border w-full'>
          <p>Mis empresas</p>
          <p>empresa 1</p>
          <p>empresa 2</p>
          <p>empresa 3</p>
          <button>Registrar nueva empresa</button>
          <button>Solicitar prestamo</button>
        </section>
      </div>
      <Footer />
    </>
  )
}
