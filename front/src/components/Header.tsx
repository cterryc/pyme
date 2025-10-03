import { Link, useNavigate } from 'react-router-dom'
import { HiOutlineChevronDown, HiOutlineUserCircle, HiOutlineClipboardList, HiOutlineLogout } from 'react-icons/hi'
import { useState } from 'react'

export const Header = ({ avatar }: { avatar: string }) => {
  const navigate = useNavigate()
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false)

  return (
    <header className='flex justify-between px-3 md:px-10 h-[60px] items-center border-b-1 border-gray-400'>
      <Link to='/' className='flex items-center gap-6'>
        <img src='assets/logo.png' className='h-[25px]' alt='' />
        <h1 className='font-medium text-2xl text-[var(--font-title-light)]'>Financia</h1>
      </Link>
      <nav className=' md:flex gap-6 hidden'>
        <Link to='/' className='hover:underline underline-offset-3'>
          Inicio
        </Link>
        <Link to='/' className='hover:underline underline-offset-3'>
          Producto
        </Link>
        <Link to='/' className='hover:underline underline-offset-3'>
          Nosotros
        </Link>
        <Link to='/' className=' hover:underline underline-offset-3'>
          Contacto
        </Link>
      </nav>
      {!avatar ? (
        <div className='relative'>
          <button
            className='h-[40px] flex gap-2 items-center hover:text-[var(--primary)] cursor-pointer'
            onClick={() => {
              setIsAvatarMenuOpen(!isAvatarMenuOpen)
            }}
          >
            <img src={avatar} className='h-full rounded-full '></img>
            <HiOutlineChevronDown className='text-xl' />
          </button>
          {isAvatarMenuOpen && (
            <ul className='absolute flex flex-col gap-2 items-start p-5 w-[180px] right-[-40px] bg-[var(--bg-light)]  '>
              <li className='hover:text-[var(--primary)]'>
                <Link to='/' className='flex gap-4 items-center '>
                  <HiOutlineUserCircle className='text-xl' /> Mi cuenta
                </Link>
              </li>
              <li className='hover:text-[var(--primary)]'>
                <Link to='/' className='flex gap-4 items-center'>
                  <HiOutlineClipboardList className='text-xl' /> Mis préstamos
                </Link>
              </li>
              <li className='hover:text-[var(--primary)]'>
                <Link to='/' className='flex gap-4 items-center'>
                  <HiOutlineLogout className='text-xl' /> Cerrar sesión
                </Link>
              </li>
            </ul>
          )}
        </div>
      ) : (
        <button
          onClick={() => navigate('/Login')}
          className='bg-[var(--primary)]  p-2 px-4 text-white rounded-lg border border-[var(--primary)] font-medium hover:bg-white hover:text-[var(--primary)] cursor-pointer'
        >
          Iniciar sesión
        </button>
      )}
    </header>
  )
}
