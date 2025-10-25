import { useDashboard } from '@/context/DashboardProvider';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { cn } from '@/lib/utils';

export const LeftDashboard = () => {
  const { modules, toggleModule, isModuleExpanded } = useDashboard();
  const location = useLocation();

  return (
    <aside className="w-64 bg-blue-600 text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-blue-500">
        <h1 className="text-xl font-bold">Panel Administrativo</h1>
        <p className="text-sm text-blue-100 mt-1">Gestión de módulos</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {modules.map((module) => {
          const isExpanded = isModuleExpanded(module.id);
          const ModuleIcon = module.icon;

          return (
            <div key={module.id} className="mb-2">
              <button
                onClick={() => toggleModule(module.id)}
                className={cn(
                  "w-full flex items-center justify-between px-6 py-3 hover:bg-blue-500 transition-colors",
                  isExpanded && ""
                )}
              >
                <div className="flex items-center gap-3">
                  <ModuleIcon className="w-5 h-5" />
                  <span className="font-medium">{module.name}</span>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>

              {isExpanded && (
                <div className="bg-blue-600 py-1">
                  {module.submodules.map((submodule) => {
                    const SubmoduleIcon = submodule.icon;
                    const isActive = location.pathname === submodule.path;

                    return (
                      <Link
                        key={submodule.id}
                        to={submodule.path}
                        className={cn(
                          "flex items-center gap-3 px-6 py-2.5 pl-12 hover:bg-blue-500 transition-colors",
                          isActive && "bg-blue-700 border-l-4 border-white"
                        )}
                      >
                        {SubmoduleIcon && <SubmoduleIcon className="w-4 h-4" />}
                        <span className="text-sm">{submodule.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-blue-500 text-xs text-blue-200">
        <p>© 2025 PyME Admin</p>
      </div>
    </aside>
  );
};
