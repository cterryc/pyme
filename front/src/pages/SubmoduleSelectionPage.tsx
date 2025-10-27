import { useDashboard } from '@/context/DashboardContext'
import { useNavigate, useParams } from 'react-router-dom'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { FiArrowLeft } from 'react-icons/fi'

export const SubmoduleSelectionPage = () => {
  const { moduleId } = useParams<{ moduleId: string }>()
  const { getModuleById } = useDashboard()
  const navigate = useNavigate()

  const module = moduleId ? getModuleById(moduleId) : undefined

  if (!module) {
    return (
      <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>Módulo no encontrado</h2>
          <button onClick={() => navigate('/admin')} className='text-blue-500 hover:text-blue-700'>
            Volver al inicio
          </button>
        </div>
      </div>
    )
  }

  const handleSubmoduleClick = (route: string) => {
    navigate(route)
  }

  const handleBackClick = () => {
    navigate('/admin')
  }

  const ModuleIcon = module.logo
  const activeSubmodules = module.submodules.filter((sub) => sub.active)

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col'>
      <Header />

      <div className='flex-1 p-8'>
        <div className='max-w-6xl mx-auto'>
          <button
            onClick={handleBackClick}
            className='flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors'
          >
            <FiArrowLeft className='mr-2' />
            Volver a módulos
          </button>

          <div className='bg-white rounded-lg shadow-md p-8 mb-8'>
            <div className='flex items-center'>
              <div className='w-20 h-20 bg-blue-500 rounded-lg flex items-center justify-center mr-6'>
                <ModuleIcon className='text-white text-4xl' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-gray-900 mb-2'>{module.name}</h1>
                <p className='text-gray-600'>{module.description}</p>
              </div>
            </div>
          </div>

          <div className='mb-6'>
            <h2 className='text-xl font-semibold text-gray-900 mb-4'>Opciones disponibles</h2>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {activeSubmodules.map((submodule) => {
              const SubmoduleIcon = submodule.logo
              return (
                <button
                  key={submodule.id}
                  onClick={() => handleSubmoduleClick(submodule.route)}
                  className='bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 text-left group'
                >
                  <div className='flex items-center mb-4'>
                    <div className='w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center group-hover:bg-green-600 transition-colors'>
                      <SubmoduleIcon className='text-white text-2xl' />
                    </div>
                  </div>

                  <h3 className='text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors'>
                    {submodule.name}
                  </h3>

                  <p className='text-gray-600 text-sm'>{submodule.description}</p>

                  <div className='mt-4 text-green-500 text-sm font-medium group-hover:text-green-700'>Acceder →</div>
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
