# 🔐 Configuración de Login y Redirección para Admin

## ✅ Configuración Completada

Se ha configurado el sistema para que cuando un **administrador** inicie sesión, sea automáticamente redirigido a su dashboard de gestión de créditos.

---

## 📋 Cambios Realizados

### **1. Login.tsx - Decodificación y Redirección**

El login ahora:
- ✅ Decodifica el token JWT para obtener el rol del usuario
- ✅ Guarda información relevante en localStorage:
  - `tokenPyme` - Token de autenticación
  - `userRole` - Rol del usuario (Admin, Owner, etc.)
  - `userId` - ID del usuario
  - `userEmail` - Email del usuario
- ✅ Redirige según el rol:
  - **Admin** → `/admin/loans` (Dashboard de gestión de créditos)
  - **Otros** → `/Dashboard` (Dashboard normal de usuario)

```tsx
// Login exitoso
if (decoded.role === 'Admin') {
  navigate('/admin/loans')  // Dashboard admin
} else {
  navigate('/Dashboard')    // Dashboard usuario
}
```

---

### **2. AdminDashboard.tsx - Ruta Agregada**

Se agregó la ruta del dashboard de gestión de créditos:

```tsx
<Route path="/loans" element={<AdminLoansManagement />} />
```

Esto hace que `/admin/loans` sea accesible y muestre el dashboard completo de gestión.

---

### **3. ProtectedAdminRoute.tsx - Protección de Rutas**

Nuevo componente que protege las rutas de administración:

```tsx
<ProtectedAdminRoute>
  <AdminDashboard />
</ProtectedAdminRoute>
```

**Validaciones que realiza:**
1. ✅ Verifica que existe un token
2. ✅ Decodifica y valida el token
3. ✅ Verifica que el rol sea `Admin`
4. ✅ Redirige apropiadamente si falla alguna validación:
   - Sin token → `/Login`
   - Token inválido → `/Login`
   - No es admin → `/Dashboard`

---

### **4. route.tsx - Rutas Protegidas**

La ruta de admin ahora está protegida:

```tsx
{
  path: '/admin/*',
  element: (
    <ProtectedAdminRoute>
      <AdminDashboard />
    </ProtectedAdminRoute>
  )
}
```

---

## 🚀 Flujo Completo

### **Usuario Admin**
```
1. Visita /Login
2. Ingresa credenciales de admin
3. Backend responde con token JWT (contiene role: "Admin")
4. Frontend decodifica el token
5. Guarda token + rol en localStorage
6. Redirige automáticamente a /admin/loans
7. Ve el dashboard de gestión de créditos
```

### **Usuario Normal (Owner)**
```
1. Visita /Login
2. Ingresa credenciales de usuario
3. Backend responde con token JWT (contiene role: "Owner")
4. Frontend decodifica el token
5. Guarda token + rol en localStorage
6. Redirige automáticamente a /Dashboard
7. Ve su dashboard personal con PyMEs
```

### **Intento de Acceso No Autorizado**
```
# Usuario intenta acceder a /admin/loans sin ser admin
1. ProtectedAdminRoute verifica el token
2. Decodifica y obtiene el rol
3. Si rol !== "Admin":
   → Redirige a /Dashboard
4. Si no hay token:
   → Redirige a /Login
```

---

## 🔍 Verificación en Desarrollo

### **Probar Login como Admin**

1. **Crear usuario admin en la base de datos** (si no existe):
```sql
-- Ejemplo PostgreSQL
UPDATE users 
SET role = 'Admin' 
WHERE email = 'admin@example.com';
```

2. **Login en el frontend**:
```
http://localhost:5173/Login
Email: admin@example.com
Password: tu_contraseña
```

3. **Verificar redirección**:
   - Debería ir automáticamente a: `http://localhost:5173/admin/loans`
   - Debería ver el dashboard de gestión de créditos

4. **Verificar localStorage**:
```javascript
// En la consola del navegador
console.log(localStorage.getItem('userRole')) // "Admin"
console.log(localStorage.getItem('tokenPyme')) // Token JWT
console.log(localStorage.getItem('userId'))    // UUID
```

---

### **Probar Login como Usuario Normal**

1. **Login con usuario normal**:
```
http://localhost:5173/Login
Email: usuario@example.com
Password: tu_contraseña
```

2. **Verificar redirección**:
   - Debería ir a: `http://localhost:5173/Dashboard`
   - Debería ver su dashboard personal

3. **Intentar acceder a ruta admin**:
```
Navegar manualmente a: http://localhost:5173/admin/loans
```
   - Debería ser redirigido automáticamente a `/Dashboard`

---

## 🛡️ Seguridad

### **Validaciones Implementadas**

1. **Backend**
   - ✅ Verifica JWT en cada request
   - ✅ Valida rol en endpoints de admin
   - ✅ Retorna 403 Forbidden si no es admin

2. **Frontend**
   - ✅ Decodifica y valida token localmente
   - ✅ Protege rutas con `ProtectedAdminRoute`
   - ✅ Redirige automáticamente si no autorizado
   - ✅ Limpia localStorage si token inválido

### **Importante**
⚠️ La validación del frontend es solo UX. La verdadera seguridad está en el backend. Siempre valida el rol en el servidor.

---

## 📝 localStorage Keys

Después del login exitoso, se guardan:

| Key | Descripción | Ejemplo |
|-----|-------------|---------|
| `tokenPyme` | Token JWT de autenticación | `eyJhbGciOiJIUzI1NiIs...` |
| `userRole` | Rol del usuario | `"Admin"` o `"Owner"` |
| `userId` | UUID del usuario | `"550e8400-e29b-41d4..."` |
| `userEmail` | Email del usuario | `"admin@example.com"` |

---

## 🔄 Logout

Para implementar logout correctamente:

```typescript
const handleLogout = () => {
  // Limpiar todo el localStorage
  localStorage.removeItem('tokenPyme')
  localStorage.removeItem('userRole')
  localStorage.removeItem('userId')
  localStorage.removeItem('userEmail')
  
  // Redirigir al login
  navigate('/Login')
}
```

---

## 🐛 Troubleshooting

### **Admin no es redirigido a /admin/loans**

1. Verificar que el usuario tenga rol `Admin` en la base de datos
2. Revisar la consola del navegador para ver el token decodificado
3. Verificar que el backend esté retornando el rol correcto en el token

```javascript
// En consola del navegador después del login
const token = localStorage.getItem('tokenPyme')
const decoded = jwtDecode(token)
console.log('Rol:', decoded.role) // Debe ser "Admin"
```

### **Redirigido al login constantemente**

1. Verificar que el token no esté expirado
2. Verificar que el token sea válido
3. Revisar la consola para errores de decodificación

### **Usuario normal puede acceder a rutas admin**

1. Verificar que `ProtectedAdminRoute` esté envolviendo las rutas
2. Verificar que el backend esté validando el rol
3. Limpiar localStorage y volver a hacer login

---

## 📦 Archivos Modificados/Creados

```
front/
├── src/
│   ├── pages/
│   │   ├── Login.tsx                     ✏️ MODIFICADO
│   │   ├── AdminDashboard.tsx            ✏️ MODIFICADO
│   │   └── AdminLoansManagement.tsx      ✅ CREADO
│   ├── components/
│   │   ├── ProtectedAdminRoute.tsx       ✅ CREADO
│   │   └── Admin/                        ✅ CREADO
│   │       ├── LoanFilters.tsx
│   │       ├── LoansTable.tsx
│   │       ├── Pagination.tsx
│   │       └── LoanDetailModal.tsx
│   ├── routes/
│   │   └── route.tsx                     ✏️ MODIFICADO
│   ├── services/
│   │   └── admin.service.ts              ✅ CREADO
│   ├── hooks/
│   │   └── Admin/
│   │       └── useAdminLoans.ts          ✅ CREADO
│   └── interfaces/
│       └── admin.interface.ts            ✅ CREADO
└── ADMIN_LOGIN_SETUP.md                  ✅ ESTE ARCHIVO
```

---

## ✨ Resumen

✅ **Login con detección automática de rol**
✅ **Redirección automática según rol**
✅ **Protección de rutas admin**
✅ **Validación de token en cliente**
✅ **Manejo de errores y redirecciones**
✅ **Dashboard completo para admin**

**Todo está listo para que los admins inicien sesión y sean dirigidos automáticamente a su dashboard de gestión de créditos!** 🎉
