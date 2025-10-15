import type { ReactNode } from 'react'
import { BiArrowFromRight } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'


interface SidebarItem {
  id: string
  label: string
  icon: string | ReactNode
  active?: boolean
}

interface SidebarProps {
  title: string
  subtitle: string
  items: SidebarItem[]
  onItemClick: (id: string) => void
  activeItem: string
}
export const Sidebar = ({ title, subtitle, items, onItemClick, activeItem }: SidebarProps) => {
  const navigate = useNavigate()
  function backToDashboard() {
    navigate("/admin", { replace: true });
  }
  return (
    <div className="w-64 bg-blue-600 text-white min-h-screen flex flex-col justify-between">
      {/* Parte superior con scroll */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-blue-500">
          <h1 className="text-xl font-bold">{title}</h1>
          {subtitle && <p className="text-blue-200 text-sm mt-1">{subtitle}</p>}
          <button className="mt-4 w-full bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center" onClick={backToDashboard}>
            <BiArrowFromRight className='pr-2 size-7' /> {' '}Volver
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="mt-6">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-blue-500 transition-colors ${activeItem === item.id
                ? "bg-blue-500 border-r-4 border-white"
                : ""
                }`}
            >
              {item.icon && (
                <span className="mr-3 text-lg">
                  {typeof item.icon === 'string' ? item.icon : item.icon}
                </span>
              )}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Parte inferior fija */}
      <div className="p-6 border-t border-blue-500">
        <button className="w-full bg-blue-500 hover:bg-blue-400 text-white py-3 px-4 rounded-lg font-medium mb-3">
          Nueva Solicitud
        </button>
        <button className="flex items-center text-blue-200 hover:text-white text-sm">
          <span className="mr-2">❓</span>
          Ayuda y Feedback
        </button>
      </div>
    </div>
  )
}