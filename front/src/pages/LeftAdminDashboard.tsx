import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Sidebar } from '@/components/Sidebar'
import { useDashboard } from '@/context/DashboardContext'
import {
    DashboardOverview,
    SolicitudesContent,
    MypesContent,
    ProductosContent,
    ConfiguracionContent
} from '@/components/dashboard'
import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

interface LeftAdminDashboardProps {
    moduleId: string
}

export const LeftAdminDashboard = ({ moduleId }: LeftAdminDashboardProps) => {
    const { getModuleById, activeSection, setActiveSection, allSubmodules } = useDashboard()
    const navigate = useNavigate()
    const location = useLocation()

    const module = getModuleById(moduleId)

    useEffect(() => {
        const currentPath = location.pathname

        const submodule = module?.submodules.find(sub => sub.route === currentPath)
        if (submodule) {
            setActiveSection(submodule.id)
        }
    }, [location.pathname])

    useEffect(() => {
        console.log(activeSection)
    }, [activeSection])

    if (!module) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Módulo no encontrado
                    </h2>
                    <button
                        onClick={() => navigate('/admin')}
                        className="text-blue-500 hover:text-blue-700"
                    >
                        Volver al inicio
                    </button>
                </div>
            </div>
        )
    }
    const sidebarItems = module.submodules
        .filter(sub => sub.active)
        .map(sub => {
            const IconComponent = sub.logo
            return {
                id: sub.id,
                label: sub.name,
                icon: <IconComponent />
            }
        })

    const handleItemClick = (itemId: string) => {
        const submodule = module.submodules.find(sub => sub.id === itemId)
        if (submodule) {
            navigate(submodule.route)
            setActiveSection(itemId)
        }
    }

    const renderContent = () => {
        switch (activeSection) {
            case 'solicitudes':
                return <SolicitudesContent />
            case 'dashboard':
                return <DashboardOverview />
            case 'mypes':
                return <MypesContent />
            case 'productos':
                return <ProductosContent />
            case 'configuracion':
                return <ConfiguracionContent />
            default:
                const firstSubmodule = module.submodules.find(sub => sub.active)
                if (firstSubmodule?.id === 'solicitudes') return <SolicitudesContent />
                if (firstSubmodule?.id === 'dashboard') return <DashboardOverview />
                if (firstSubmodule?.id === 'mypes') return <MypesContent />
                if (firstSubmodule?.id === 'productos') return <ProductosContent />
                if (firstSubmodule?.id === 'configuracion') return <ConfiguracionContent />
                return <DashboardOverview />
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <Header avatar='/assets/defaultAvatar.jpg' />

            <div className="flex flex-1">
                <Sidebar
                    title={module.name}
                    subtitle={module.description}
                    items={sidebarItems}
                    onItemClick={handleItemClick}
                    activeItem={activeSection}
                />

                {renderContent()}
            </div>

            <Footer />
        </div>
    )
}
