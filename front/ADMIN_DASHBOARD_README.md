# 📊 Dashboard de Administración - Gestión de Créditos

Dashboard completo para que los administradores puedan gestionar, revisar y cambiar el estado de las solicitudes de crédito en tiempo real.

---

## 📁 Archivos Creados

### **Interfaces TypeScript**
```
src/interfaces/admin.interface.ts
```
- Definiciones de tipos para las respuestas de la API
- Tipos de estado de solicitudes
- Parámetros de búsqueda y filtros
- Request bodies para actualización de estado

### **Servicios de API**
```
src/services/admin.service.ts
```
- `listCreditApplications()` - Lista con filtros y paginación
- `getCreditApplicationDetail()` - Detalle completo de una solicitud
- `updateCreditApplicationStatus()` - Actualiza el estado

### **Hooks Personalizados**
```
src/hooks/Admin/useAdminLoans.ts
```
- `useListCreditApplications()` - Hook para listar con React Query
- `useGetCreditApplicationDetail()` - Hook para obtener detalles
- `useUpdateCreditApplicationStatus()` - Hook para actualizar estado con cache invalidation

### **Componentes UI**
```
src/components/Admin/
├── LoanFilters.tsx          # Filtros de búsqueda avanzados
├── LoansTable.tsx           # Tabla de solicitudes
├── Pagination.tsx           # Componente de paginación
└── LoanDetailModal.tsx      # Modal con detalle completo y cambio de estado
```

### **Página Principal**
```
src/pages/AdminLoansManagement.tsx
```
Dashboard completo que integra todos los componentes.

---

## 🚀 Cómo Usar

### 1. **Agregar la Ruta**

En tu archivo de rutas (`App.tsx` o `router.tsx`), agrega:

```tsx
import { AdminLoansManagement } from "@/pages/AdminLoansManagement";

// En tu configuración de rutas protegidas para admin:
<Route path="/admin/loans" element={<AdminLoansManagement />} />
```

### 2. **Asegurar que el Usuario Tenga Rol Admin**

El backend ya valida el rol ADMIN, pero en el frontend deberías:

```tsx
// Ejemplo de protección de ruta
const userRole = localStorage.getItem("userRole"); // o desde tu contexto de auth

if (userRole !== "Admin") {
  return <Navigate to="/dashboard" />;
}
```

### 3. **Variables de Entorno**

Asegúrate de tener configurado el `.env`:
```
VITE_API_URL=http://localhost:8082/api
```

---

## ✨ Características Implementadas

### **Listado de Solicitudes**
- ✅ Paginación automática
- ✅ Filtros por:
  - Estado
  - Monto (rango)
  - Búsqueda general (empresa, email, número)
- ✅ Ordenamiento por diferentes campos
- ✅ Información resumida de cada solicitud
- ✅ Indicador de documentos pendientes

### **Detalle de Solicitud**
- ✅ Información completa de la empresa
- ✅ Datos del propietario
- ✅ Detalles de la oferta del sistema
- ✅ Selección del usuario
- ✅ Lista de documentos con links para descargar
- ✅ Historial completo de cambios de estado
- ✅ Notas internas y razones de rechazo

### **Gestión de Estado**
- ✅ Cambio de estado con validación de transiciones
- ✅ Campos requeridos según el estado:
  - **Rechazado**: Razón obligatoria
  - **Aprobado**: Monto aprobado obligatorio
- ✅ Campos opcionales:
  - Risk Score (0-100)
  - Notas internas
  - Razón del cambio
- ✅ Actualización en tiempo real
- ✅ Invalidación automática de cache

### **Transiciones de Estado Permitidas**
```
Enviado → En revisión, Cancelado
En revisión → Documentos requeridos, Aprobado, Rechazado
Documentos requeridos → En revisión, Rechazado
Aprobado → Desembolsado, Cancelado
Rechazado → (Estado final)
Desembolsado → (Estado final)
Cancelado → (Estado final)
```

---

## 📊 Pantallas del Dashboard

### **Vista Principal**
- Estadísticas rápidas (total, página actual, etc.)
- Filtros de búsqueda avanzados
- Tabla con todas las solicitudes
- Paginación

### **Modal de Detalle**
- Información completa en secciones organizadas:
  - Información de la Empresa
  - Propietario
  - Oferta del Sistema
  - Selección del Usuario
  - Fechas importantes
  - Documentos
  - Historial de Estados
- Formulario de actualización de estado
- Validaciones en tiempo real

---

## 🎨 Diseño y UX

### **Colores por Estado**
- **Enviado**: Azul
- **En revisión**: Amarillo
- **Documentos requeridos**: Naranja
- **Aprobado**: Verde
- **Rechazado**: Rojo
- **Desembolsado**: Púrpura
- **Cancelado**: Gris

### **Responsivo**
- ✅ Diseño adaptable para desktop, tablet y móvil
- ✅ Tabla con scroll horizontal en pantallas pequeñas
- ✅ Modal optimizado para diferentes tamaños

### **Feedback Visual**
- ✅ Loading spinners
- ✅ Toasts de éxito/error con Sonner
- ✅ Estados disabled mientras se procesa
- ✅ Hover effects en botones y filas

---

## 🔔 Integración con SSE

Cuando el admin cambia el estado de una solicitud:
1. El backend actualiza la base de datos
2. **Envía notificación SSE al usuario propietario**
3. El usuario ve en su dashboard: `"El crédito CRD-12345 cambió de estado a 'Aprobado'"`
4. El dashboard del admin se actualiza automáticamente (React Query)

---

## 🛠️ Flujo de Trabajo Típico

### 1. **Revisar Solicitudes Pendientes**
```
1. Ir a /admin/loans
2. Filtrar por estado "Enviado"
3. Ordenar por fecha de envío (más antiguas primero)
```

### 2. **Revisar una Solicitud**
```
1. Click en "Ver Detalle"
2. Revisar información de la empresa
3. Verificar documentos
4. Cambiar estado a "En revisión"
```

### 3. **Aprobar/Rechazar**
```
# Aprobar
1. Seleccionar "Aprobado"
2. Ingresar monto aprobado
3. Opcionalmente agregar risk score y notas
4. Click en "Actualizar Estado"

# Rechazar
1. Seleccionar "Rechazado"
2. Ingresar razón (obligatorio)
3. Opcionalmente agregar risk score
4. Click en "Actualizar Estado"
```

### 4. **Desembolsar**
```
1. Desde una solicitud "Aprobada"
2. Cambiar a "Desembolsado"
3. El usuario recibe notificación
```

---

## 🧪 Testing

### **Probar Filtros**
```tsx
// Buscar por empresa
Search: "Mi Empresa"

// Filtrar por estado
Estado: "Enviado"

// Rango de montos
Monto Mínimo: 10000
Monto Máximo: 100000
```

### **Probar Paginación**
```tsx
// Cambiar límite
limit: 20

// Navegar páginas
Page 1 → Page 2 → Page 3
```

### **Probar Cambio de Estado**
```tsx
// 1. Crear solicitud como usuario
// 2. Login como admin
// 3. Cambiar estado a "En revisión"
// 4. Verificar notificación SSE en el frontend del usuario
// 5. Aprobar/Rechazar
```

---

## 📝 Notas Importantes

### **Permisos**
- Solo usuarios con rol `Admin` pueden acceder
- El backend valida el rol en cada request
- El frontend debería también proteger la ruta

### **Cache**
- React Query maneja el cache automáticamente
- `staleTime`: 2 minutos para lista, 5 minutos para detalle
- Se invalida automáticamente después de actualizar

### **Validaciones**
- Las transiciones de estado se validan en el backend
- El frontend muestra solo opciones válidas
- Mensajes de error claros si algo falla

### **Performance**
- Paginación del lado del servidor
- Filtros se aplican en la base de datos
- No se cargan datos innecesarios

---

## 🐛 Troubleshooting

### **No se muestran solicitudes**
1. Verificar que el token en localStorage sea de un admin
2. Revisar la consola del navegador para errores
3. Verificar que el backend esté corriendo
4. Revisar permisos CORS

### **No se puede cambiar el estado**
1. Verificar que la transición sea válida
2. Completar campos obligatorios (razón para rechazo, monto para aprobación)
3. Verificar token de admin válido

### **Modal no se cierra**
- El modal se cierra automáticamente después de actualizar exitosamente
- Puede cerrarse manualmente con el botón "Cerrar"
- Verificar que no haya errores en la consola

---

## 🚀 Próximas Mejoras Sugeridas

- [ ] Exportar lista a CSV/Excel
- [ ] Gráficos y estadísticas avanzadas
- [ ] Filtros por fechas con date picker
- [ ] Notas y comentarios en thread
- [ ] Notificaciones push al admin
- [ ] Bulk actions (cambiar múltiples estados a la vez)
- [ ] Vista de documentos inline (PDF viewer)
- [ ] Historial de auditoría más detallado

---

## 📞 Soporte

Para cualquier duda o problema con el dashboard de administración:
1. Revisar esta documentación
2. Revisar la documentación del backend (`ADMIN_ENDPOINTS.md`)
3. Consultar los logs del navegador y del backend
