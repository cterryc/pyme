import { createContext, type ReactNode, useContext, useState, type ComponentType, lazy } from 'react';
import { Home, FileText, Users, Settings } from 'lucide-react';

// Tipos
export interface SubModule {
    id: string;
    name: string;
    path: string;
    permissionId: string;
    icon?: ComponentType<{ className?: string }>;
}

export interface Module {
    id: string;
    name: string;
    icon: ComponentType<{ className?: string }>;
    permissionId: string;
    submodules: SubModule[];
}

interface DashboardContextType {
    modules: Module[];
    expandedModules: string[];
    toggleModule: (moduleId: string) => void;
    isModuleExpanded: (moduleId: string) => boolean;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

// Hook personalizado
export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error('useDashboard debe ser usado dentro de DashboardProvider');
    }
    return context;
};

const modulesData: Module[] = [
    {
        id: 'gestion',
        name: 'Gestión',
        icon: Home,
        permissionId: 'perm_9a8b7c6d5e4f',
        submodules: [
            {
                id: 'dashboard',
                name: 'Dashboard',
                path: '/dashboard',
                permissionId: 'perm_1a2b3c4d5e6f',
                icon: Home,
            },
            {
                id: 'solicitudes',
                name: 'Solicitudes',
                path: '/solicitudes',
                permissionId: 'perm_2b3c4d5e6f7a',
                icon: FileText,
            },
        ],
    },
    {
        id: 'clientes',
        name: 'Clientes',
        icon: Users,
        permissionId: 'perm_3c4d5e6f7a8b',
        submodules: [
            {
                id: 'listado-clientes',
                name: 'Listado de Clientes',
                path: '/clients/list',
                permissionId: 'perm_4d5e6f7a8b9c',
                icon: Users,
            },
        ],
    },
    {
        id: 'mypes',
        name: 'PyMEs',
        icon: Users,
        permissionId: 'perm_3c4d5e6f7a8b',
        submodules: [
            {
                id: 'listado-pymes',
                name: 'Listado de PyMEs',
                path: '/pymes/list',
                permissionId: 'perm_5d6e7f8g9h0i',
                icon: Users,
            },
        ],
    },
        {
        id: 'solicitudes',
        name: 'Solicitudes',
        icon: Users,
        permissionId: 'perm_3c4d5e6f7a8b',
        submodules: [
            {
                id: 'listado-solicitudes',
                name: 'Listado de Solicitudes',
                path: '/requests/list',
                permissionId: 'perm_5d6e7f8g9h0i',
                icon: Users,
            },
        ],
    },
    {
        id: 'configuracion',
        name: 'Sistema',
        icon: Settings,
        permissionId: 'perm_7a8b9c0d1e2f',
        submodules: [
            {
                id: 'config-general',
                name: 'Configuración',
                path: '/system/config',
                permissionId: 'perm_8b9c0d1e2f3a',
                icon: Settings,
            },
        ],
    },
];

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
    const [expandedModules, setExpandedModules] = useState<string[]>([]);

    const toggleModule = (moduleId: string) => {
        setExpandedModules((prev) =>
            prev.includes(moduleId)
                ? prev.filter((id) => id !== moduleId)
                : [...prev, moduleId]
        );
    };

    const isModuleExpanded = (moduleId: string) => {
        return expandedModules.includes(moduleId);
    };

    return (
        <DashboardContext.Provider
            value={{
                modules: modulesData,
                expandedModules,
                toggleModule,
                isModuleExpanded,
            }}
        >
            {children}
        </DashboardContext.Provider>
    );
};
