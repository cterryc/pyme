# 🔧 Variables de Entorno para Render

## ⚠️ VERIFICAR ESTAS VARIABLES EN RENDER DASHBOARD

### ✅ Variables Obligatorias para Base de Datos:

```bash
# Node Environment
NODE_ENV=production

# Puerto (Render lo asigna automáticamente, NO lo configures manualmente)
# PORT=(automático)

# Modo de servidor (NO usar CLUSTER en producción)
MODE=FORK

# Base de Datos - OPCIÓN 1: DATABASE_URL (Recomendado para Render/Supabase)
DATABASE_URL=postgresql://user:password@host:5432/database

# Base de Datos - OPCIÓN 2: Variables individuales
DB_HOST=tu_host.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USERNAME=postgres
DB_PASSWORD=tu_password_super_segura
DB_SSL=true

# JWT Secret (GENERAR CON: openssl rand -base64 64)
JWT_SECRET=tu_jwt_secret_de_64_caracteres_minimo

# Frontend URL
FRONTEND_URL=https://tu-frontend.vercel.app

# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_BUCKET_NAME=tu_bucket_name
```

---

## 🔍 Diagnóstico del Error Actual

### Error: "Connection terminated due to connection timeout"

Esto significa que:
1. ❌ Las credenciales de la base de datos son incorrectas
2. ❌ El host de la base de datos no es accesible desde Render
3. ❌ El puerto está bloqueado
4. ❌ La base de datos no acepta conexiones externas

### ✅ Soluciones:

#### Si usas Supabase:
1. Ve a tu proyecto en Supabase Dashboard
2. Settings → Database → Connection String
3. Copia el "Connection String" (URI mode)
4. En Render, configura:
   ```
   DATABASE_URL=postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
   DB_SSL=true
   ```

#### Si usas base de datos de Render:
1. Ve a tu base de datos en Render Dashboard
2. Copia la "Internal Database URL"
3. En tu servicio web, configura:
   ```
   DATABASE_URL=(pegar la URL copiada)
   DB_SSL=true
   ```

---

## 🚀 Orden de Verificación:

1. ✅ Verificar que `MODE=FORK` (NO "CLUSTER")
2. ✅ Verificar que `NODE_ENV=production`
3. ✅ Verificar que `DB_SSL=true`
4. ✅ Verificar que las credenciales de la base de datos son correctas
5. ✅ Si usas Supabase, usar la URL con `:6543` (pooler)
6. ✅ Reiniciar el deploy después de cambiar las variables

---

## 📝 Nota Importante:

**NO configures manualmente la variable PORT en Render.**
Render la asigna automáticamente y el código ya la usa correctamente.
