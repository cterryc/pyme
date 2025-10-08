interface SidebarItem {
  id: string
  label: string
  icon: string
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
  return (
    <div className="w-64 bg-blue-600 text-white min-h-screen">
      {/* Header */}
      <div className="p-6 border-b border-blue-500">
        <h1 className="text-xl font-bold">{title}</h1>
        <p className="text-blue-200 text-sm mt-1">{subtitle}</p>
      </div>

      {/* Navigation Items */}
      <nav className="mt-6">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onItemClick(item.id)}
            className={`w-full flex items-center px-6 py-3 text-left hover:bg-blue-500 transition-colors ${
              activeItem === item.id ? 'bg-blue-500 border-r-4 border-white' : ''
            }`}
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="absolute bottom-6 left-6 right-6">
        <button className="w-full bg-blue-500 hover:bg-blue-400 text-white py-3 px-4 rounded-lg font-medium mb-4">
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