import { useDashboard } from '@/context/DashboardContext'
import { useNavigate } from 'react-router-dom'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { toast } from 'sonner'

export const ModuleSelectionPage = () => {
  const { getActiveModules } = useDashboard()
  const navigate = useNavigate()
  const activeModules = getActiveModules()

  const handleModuleClick = (moduleId: string) => {
    const module = activeModules.find(m => m.id === moduleId)
    if (module) {
      toast.info(`Accediendo a ${module.name}`, {
        style: { borderColor: '#0095d5', backgroundColor: '#e6f4fb', borderWidth: '2px' },
        description: module.description,
        duration: 2500
      })
    }
    navigate(`/admin/modules/${moduleId}`)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header avatar='/assets/defaultAvatar.jpg' />
      
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-6xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Financia - Panel de Administración
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeModules.map((module) => {
              const IconComponent = module.logo
              return (
                <button
                  key={module.id}
                  onClick={() => handleModuleClick(module.id)}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-8 text-left group"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                      <IconComponent className="text-white text-3xl" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {module.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm">
                    {module.description}
                  </p>

                  <div className="mt-4 text-blue-500 text-sm font-medium group-hover:text-blue-700">
                    Ver opciones →
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
