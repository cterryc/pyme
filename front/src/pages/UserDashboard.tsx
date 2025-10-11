import { NavLink, Outlet } from "react-router-dom";
import { FaUser, FaBuilding } from "react-icons/fa";
import { HiMiniDocumentCheck } from "react-icons/hi2";
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export const UserDashboard = () => {
  return (
    <section className='flex flex-col min-h-screen'>
      <Header />
      <section className='flex flex-1'>
        <aside className='flex flex-col gap-1 flex-1 py-5 px-3 border-r-2 border-gray-200'>
          <NavLink
            to="/Dashboard"
            className="group flex items-center gap-2 text-xl p-2 rounded-lg hover:bg-[#28a9d622] cursor-pointer text-gray-400 hover:text-[#23a9d6]"
          >
            <FaUser className="h-6 w-6 text-gray-400 group-hover:text-[#23a9d6]" />
            Perfil
          </NavLink>
          <NavLink
            to="/Dashboard/Pymes"
            className='group flex items-center gap-2 text-xl p-2 rounded-lg hover:bg-[#28a9d622] cursor-pointer text-gray-400 hover:text-[#23a9d6]'
          >
            <FaBuilding className='h-6 w-6 text-gray-400 group-hover:text-[#23a9d6]' />
            Pymes
          </NavLink>
          <NavLink
            to="/Dashboard/Solicitudes"
            className='group flex items-center gap-2 text-xl p-2 rounded-lg hover:bg-[#28a9d622] cursor-pointer text-gray-400 hover:text-[#23a9d6]'>
            <HiMiniDocumentCheck className='h-6 w-6 text-gray-400 group-hover:text-[#23a9d6]' />
            Solicitudes
          </NavLink>
        </aside>
        <div className="flex-[6] min-w-0 p-7 overflow-x-auto">
          <Outlet />
        </div>
      </section>
      <Footer />
    </section>
  )
}
