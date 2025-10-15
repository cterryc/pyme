import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { useDashboard } from '@/context/DashboardContext'
import {
    DashboardOverview,
    SolicitudesContent,
    MypesContent,
    ProductosContent,
    ConfiguracionContent
} from '@/components/dashboard'
import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { FiChevronDown, FiChevronRight } from 'react-icons/fi'

export const LeftAdminDashboard = () => {
    const { getActiveModules, activeSection, setActiveSection, getSubmoduleByRoute } = useDashboard()
    const navigate = useNavigate()
    const location = useLocation()
    const [expandedModules, setExpandedModules] = useState<string[]>([])

    const activeModules = getActiveModules()

    // Set active section based on current route
    useEffect(() => {
        const currentPath = location.pathname
        const result = getSubmoduleByRoute(currentPath)
        
        if (result) {
            setActiveSection(result.submodule.id)
            // Auto-expand the module that contains the active submodule
            if (!expandedModules.includes(result.module.id)) {
                setExpandedModules(prev => [...prev, result.module.id])
            }
        }
    }, [location.pathname])

    const toggleModule = (moduleId: string) => {
        setExpandedModules(prev => 
            prev.includes(moduleId) 
                ? prev.filter(id => id !== moduleId)
                : [...prev, moduleId]
        )
    }

    const handleSubmoduleClick = (route: string, submoduleId: string) => {
        navigate(route)
        setActiveSection(submoduleId)
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
                // Find first active submodule from all modules
                const firstModule = activeModules.find(m => m.submodules.some(s => s.active))
                const firstSubmodule = firstModule?.submodules.find(s => s.active)
                
                if (firstSubmodule) {
                    if (firstSubmodule.id === 'solicitudes') return <SolicitudesContent />
                    if (firstSubmodule.id === 'dashboard') return <DashboardOverview />
                    if (firstSubmodule.id === 'mypes') return <MypesContent />
                    if (firstSubmodule.id === 'productos') return <ProductosContent />
                    if (firstSubmodule.id === 'configuracion') return <ConfiguracionContent />
                }
                return <DashboardOverview />
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <Header avatar='/assets/defaultAvatar.jpg' />

            <div className="flex flex-1">
                {/* Collapsible Sidebar */}
                <div className="w-64 bg-blue-600 text-white min-h-screen flex flex-col">
                    <div className="flex-1 overflow-y-auto">
                        {/* Header */}
                        <div className="p-6 border-b border-blue-500">
                            <h1 className="text-xl font-bold">Panel Administrativo</h1>
                            <p className="text-blue-200 text-sm mt-1">Gestión de módulos</p>
                        </div>

                        {/* Modules Navigation */}
                        <nav className="mt-6">
                            {activeModules.map((module) => {
                                const ModuleIcon = module.logo
                                const isExpanded = expandedModules.includes(module.id)
                                const activeSubmodules = module.submodules.filter(sub => sub.active)

                                return (
                                    <div key={module.id}>
                                        {/* Module Header */}
                                        <button
                                            onClick={() => toggleModule(module.id)}
                                            className="w-full flex items-center justify-between px-6 py-3 hover:bg-blue-500 transition-colors"
                                        >
                                            <div className="flex items-center">
                                                <ModuleIcon className="mr-3 text-lg" />
                                                <span className="font-medium">{module.name}</span>
                                            </div>
                                            {isExpanded ? (
                                                <FiChevronDown className="text-lg" />
                                            ) : (
                                                <FiChevronRight className="text-lg" />
                                            )}
                                        </button>

                                        {/* Submodules (collapsible) */}
                                        {isExpanded && (
                                            <div className="bg-blue-600">
                                                {activeSubmodules.map((submodule) => {
                                                    const SubmoduleIcon = submodule.logo
                                                    const isActive = activeSection === submodule.id

                                                    return (
                                                        <button
                                                            key={submodule.id}
                                                            onClick={() => handleSubmoduleClick(submodule.route, submodule.id)}
                                                            className={`w-full flex items-center px-10 py-2 text-left hover:bg-blue-400 transition-colors text-sm ${
                                                                isActive ? 'bg-blue-700 border-r-4 border-white hover:bg-blue-700' : ''
                                                            }`}
                                                        >
                                                            <SubmoduleIcon className="mr-3" />
                                                            <span>{submodule.name}</span>
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </nav>
                    </div>

                    {/* Bottom Actions */}
                    <div className="p-6 border-t border-blue-500">
                        <button 
                            onClick={() => navigate('/admin')}
                            className="w-full bg-blue-500 hover:bg-blue-400 text-white py-3 px-4 rounded-lg font-medium mb-3"
                        >
                            Volver a Módulos
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                {renderContent()}
            </div>

            <Footer />
        </div>
    )
}
