# Admin Dashboard - Módulos y Submódulos

## Arquitectura

El AdminDashboard ha sido completamente refactorizado para manejar una estructura modular basada en **Módulos** y **Submódulos**.

### Estructura de Componentes

```
AdminDashboard (Main Router)
├── ModuleSelectionPage (Vista de selección de módulos)
├── SubmoduleSelectionPage (Vista de submódulos por módulo)
└── LeftAdminDashboard (Dashboard con sidebar izquierdo)
    ├── Sidebar (Navegación lateral)
    └── Submodule Content (Contenido específico del submódulo)
```

### Flujo de Navegación

1. **`/admin`** - Pantalla principal que muestra todos los módulos disponibles
2. **`/admin/modules/:moduleId`** - Pantalla que muestra los submódulos de un módulo específico
3. **`/admin/:module/:submodule`** - Vista del submódulo con sidebar izquierdo

## Tipos de Datos

### Module Interface

```typescript
interface Module {
  id: string              // Identificador único
  name: string           // Nombre del módulo
  description: string    // Descripción del módulo
  logo: IconType         // Componente de icono (react-icons)
  active: boolean        // Si el módulo está activo
  permissionId: string   // ID de permiso (para control de acceso)
  submodules: Submodule[] // Array de submódulos
}
```

### Submodule Interface

```typescript
interface Submodule {
  id: string              // Identificador único
  name: string           // Nombre del submódulo
  description: string    // Descripción del submódulo
  logo: IconType         // Componente de icono (react-icons)
  active: boolean        // Si el submódulo está activo
  permissionId: string   // ID de permiso (para control de acceso)
  route: string          // Ruta de navegación
}
```

## Cómo Agregar un Nuevo Módulo

### Paso 1: Actualizar DashboardContext

Edita `src/context/DashboardContext.tsx` y agrega tu nuevo módulo al array `modules`:

```typescript
const modules: Module[] = [
  // ... módulos existentes
  {
    id: 'mi-nuevo-modulo',
    name: 'Mi Nuevo Módulo',
    description: 'Descripción de mi nuevo módulo',
    logo: FiShoppingCart, // Importa el icono desde react-icons/fi
    active: true,
    permissionId: 'perm_mi_modulo_' + Math.random().toString(36).substr(2, 9),
    submodules: [
      {
        id: 'submodulo-1',
        name: 'Submódulo 1',
        description: 'Descripción del submódulo',
        logo: FiList,
        active: true,
        permissionId: 'perm_submodulo1_' + Math.random().toString(36).substr(2, 9),
        route: '/admin/mi-nuevo-modulo/submodulo-1'
      }
    ]
  }
]
```

### Paso 2: Crear el Componente del Submódulo

Crea tu componente en `src/components/dashboard/MiSubmoduloContent.tsx`:

```typescript
export const MiSubmoduloContent = () => {
  return (
    <div className="flex-1 bg-white p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Mi Submódulo
      </h1>
      {/* Tu contenido aquí */}
    </div>
  )
}
```

### Paso 3: Exportar el Componente

Agrega la exportación en `src/components/dashboard/index.ts`:

```typescript
export { MiSubmoduloContent } from './MiSubmoduloContent'
```

### Paso 4: Actualizar LeftAdminDashboard

Edita `src/pages/LeftAdminDashboard.tsx` y agrega:

1. **Importar el componente**:
```typescript
import { MiSubmoduloContent } from '@/components/dashboard'
```

2. **Agregar case en renderContent**:
```typescript
const renderContent = () => {
  switch (activeSection) {
    // ... casos existentes
    case 'submodulo-1':
      return <MiSubmoduloContent />
    // ...
  }
}
```

### Paso 5: Agregar Ruta en AdminDashboard

Edita `src/pages/AdminDashboard.tsx` y agrega la ruta del submódulo:

```typescript
const AdminDashboardRoutes = () => {
  return (
    <Routes>
      {/* ... rutas existentes */}
      
      {/* Tu nuevo módulo */}
      <Route path="/mi-nuevo-modulo/submodulo-1" element={<LeftAdminDashboard moduleId="mi-nuevo-modulo" />} />
    </Routes>
  )
}
```

## Ejemplo Completo: Agregar Módulo de Reportes

```typescript
// 1. En DashboardContext.tsx
import { FiTrendingUp, FiBarChart, FiPieChart } from 'react-icons/fi'

const modules: Module[] = [
  // ... módulos existentes
  {
    id: 'reports',
    name: 'Reportes',
    description: 'Análisis y reportes financieros',
    logo: FiTrendingUp,
    active: true,
    permissionId: 'perm_reports_' + Math.random().toString(36).substr(2, 9),
    submodules: [
      {
        id: 'financial-reports',
        name: 'Reportes Financieros',
        description: 'Análisis financiero detallado',
        logo: FiBarChart,
        active: true,
        permissionId: 'perm_financial_reports_' + Math.random().toString(36).substr(2, 9),
        route: '/admin/reports/financial'
      },
      {
        id: 'client-analytics',
        name: 'Análisis de Clientes',
        description: 'Estadísticas de clientes',
        logo: FiPieChart,
        active: true,
        permissionId: 'perm_client_analytics_' + Math.random().toString(36).substr(2, 9),
        route: '/admin/reports/clients'
      }
    ]
  }
]

// 2. Crear componentes en src/components/dashboard/
// FinancialReportsContent.tsx
// ClientAnalyticsContent.tsx

// 3. Actualizar index.ts
export { FinancialReportsContent } from './FinancialReportsContent'
export { ClientAnalyticsContent } from './ClientAnalyticsContent'

// 4. Actualizar LeftAdminDashboard.tsx en renderContent()
case 'financial-reports':
  return <FinancialReportsContent />
case 'client-analytics':
  return <ClientAnalyticsContent />

// 5. Agregar rutas en AdminDashboard.tsx
<Route path="/reports/financial" element={<LeftAdminDashboard moduleId="reports" />} />
<Route path="/reports/clients" element={<LeftAdminDashboard moduleId="reports" />} />
```

## Notas Importantes

1. **IDs únicos**: Asegúrate de que los IDs de módulos y submódulos sean únicos
2. **Rutas consistentes**: Las rutas deben seguir el patrón `/admin/{moduleId}/{submoduleId}`
3. **Iconos**: Importa iconos desde `react-icons/fi` para consistencia visual
4. **Active flag**: Usa el flag `active` para controlar visibilidad sin eliminar código
5. **Permisos**: Los `permissionId` están listos para integración con sistema de autenticación
