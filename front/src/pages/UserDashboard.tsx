import { NavLink, Outlet } from 'react-router-dom'
import { FaUser, FaBuilding } from 'react-icons/fa'
import { HiMiniDocumentCheck } from 'react-icons/hi2'
import { FiMenu, FiX } from 'react-icons/fi'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useState } from 'react'
import { useSSENotifications } from '@/hooks/useSSENotifications'

export const UserDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Conectar a SSE para recibir notificaciones en tiempo real
  useSSENotifications()

  const handleLinkClick = () => {
    setIsSidebarOpen(false)
  }

  return (
    <section className='flex flex-col min-h-screen'>
      <Header />

      {/* Mobile Menu Button */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className='lg:hidden fixed top-10 left-4 z-[60] bg-[#23a9d6] text-white p-3 rounded-lg shadow-lg hover:bg-[#1e8db8] transition-colors'
          aria-label='Toggle menu'
        >
          <FiMenu className='text-xl' />
        </button>
      )}

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className='lg:hidden fixed inset-0 bg-black z-[40]'
          style={{
            opacity: 0.5
          }}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <section className='flex flex-1'>
        <aside
          className={`
          fixed lg:static inset-y-0 left-0 z-[50]
          flex flex-col w-64 lg:flex-1 py-5 px-3 
          bg-white lg:border-r-2 border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          shadow-xl lg:shadow-none
        `}
        >
          {/* Sidebar Header - Solo visible en móvil */}
          <div className='lg:hidden flex items-center justify-between mb-6 pb-4 border-b border-gray-200'>
            <div className='flex items-center gap-2'>
              <img src='/assets/logo.png' alt='Logo' className='h-8 w-auto' />
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
              aria-label='Cerrar menú'
            >
              <FiX className='text-2xl text-gray-600' />
            </button>
          </div>

          {/* Navigation Links */}
          <div className='flex flex-col gap-1 flex-1 relative'>
            <NavLink
              to='/panel'
              end
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `group flex items-center gap-2 text-xl p-2 rounded-lg cursor-pointer transition-all ${
                  isActive
                    ? 'bg-[#23a9d6] text-white shadow-md'
                    : 'text-gray-400 hover:bg-[#28a9d622] hover:text-[#23a9d6]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <FaBuilding
                    className={`h-6 w-6 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-[#23a9d6]'}`}
                  />
                  Pymes
                </>
              )}
            </NavLink>
            <NavLink
              to='/panel/solicitudes'
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `group flex items-center gap-2 text-xl p-2 rounded-lg cursor-pointer transition-all ${
                  isActive
                    ? 'bg-[#23a9d6] text-white shadow-md'
                    : 'text-gray-400 hover:bg-[#28a9d622] hover:text-[#23a9d6]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <HiMiniDocumentCheck
                    className={`h-6 w-6 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-[#23a9d6]'}`}
                  />
                  Solicitudes
                </>
              )}
            </NavLink>
            <NavLink
              to='/panel/perfil'
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `group absolute w-full bottom-1 flex items-center gap-2 text-xl p-2 rounded-lg cursor-pointer transition-all ${
                  isActive
                    ? 'bg-[#23a9d6] text-white shadow-md'
                    : 'text-gray-400 hover:bg-[#28a9d622] hover:text-[#23a9d6]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <FaUser
                    className={`h-6 w-6 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-[#23a9d6]'}`}
                  />
                  Perfil
                </>
              )}
            </NavLink>
          </div>
        </aside>
        <div className='flex-[6] min-w-0 p-7 overflow-x-auto w-full lg:w-auto'>
          <Outlet />
        </div>
      </section>
      <Footer />
    </section>
  )
}
