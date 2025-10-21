import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HiOutlineChevronDown, HiOutlineUserCircle, HiOutlineLogout } from 'react-icons/hi'
import { useUserAuthenticate } from '@/hooks/useUser'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const Header = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false)

  const imageDefault = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaotZTcu1CLMGOJMDl-f_LYBECs7tqwhgpXA&s'

  const { hasUser } = useUserAuthenticate()

  const deleteToken = () => {

    toast.info('Cerrando sesión...', {
      style: { borderColor: '#0095d5', backgroundColor: '#e6f4fb', borderWidth: '2px' },
      description: 'Hasta pronto. Esperamos verte de nuevo.',
      duration: 2000
    })
    localStorage.removeItem('tokenPyme')

    // localStorage.removeItem('tokenPyme')
    localStorage.clear()

    queryClient.clear()
    setTimeout(() => {
      navigate('/Login')
    }, 500)
  }

  return (
    <header className='flex justify-between p-3 md:px-10 items-center border-b-1 border-gray-200'>
      <Link to='/' className='flex items-center gap-6'>
        <img src='/assets/logo.png' className='h-[25px]' alt='' />
        <h1 className='font-medium text-2xl text-[var(--font-title-light)]'>Financia</h1>
      </Link>
      {hasUser ? (
        <div className='relative'>
          <button
            className='h-[40px] flex gap-3 items-center hover:text-[var(--primary)] cursor-pointer'
            onClick={() => {
              setIsAvatarMenuOpen(!isAvatarMenuOpen)
            }}
          >
            <img src={imageDefault} className='w-8 h-8 rounded-full' />
            <HiOutlineChevronDown className='text-xl' />
          </button>
          {isAvatarMenuOpen && (
            <ul className='absolute flex flex-col gap-2 items-start p-5 w-[180px] right-0 top-13 bg-[var(--bg-light)] outline-gray-200 outline-1'>
              <li className='hover:text-[var(--primary)]'>
                <Link to='/Dashboard' className='flex gap-4 items-center '>
                  <HiOutlineUserCircle className='text-xl' /> Mi cuenta
                </Link>
              </li>
              <li className='hover:text-[var(--primary)]'>
                <button onClick={deleteToken} className='flex gap-4 items-center text-left'>
                  <HiOutlineLogout className='text-xl' /> Cerrar sesión
                </button>
              </li>
            </ul>
          )}
        </div>
      ) : (
        <div className='flex gap-2'>
          <button
            onClick={() => navigate('/Login')}
            className=' text-[#0095d5] outline-1 h-10 w-32 rounded-md hover:outline-1 transition-colors
            cursor-pointer hover:bg-[#F0F0F2]'
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => navigate('/Registro')}
            className='bg-[#0095d5] text-white outline-1 h-10 w-32 rounded-md hover:bg-[#28a9d6] transition-colors cursor-pointer'
          >
            Registrate
          </button>
        </div>
      )}
    </header>
  )
}
