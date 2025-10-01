# 🏦 Plataforma de Créditos para PYMEs - Backend

API REST para gestión de solicitudes de crédito para Pequeñas y Medianas Empresas (PYMEs) con verificación KYC/AML, carga de documentos y firma digital.

## 📋 Descripción del Proyecto

### Necesidad del Cliente

Las PYMEs requieren:
- ✅ Financiación rápida y accesible
- ✅ Procesos de solicitud menos burocráticos
- ✅ Validación digital de información
- ✅ Reducción de tiempos de aprobación
- ✅ Experiencia de usuario mejorada

### Solución

Plataforma web que permite a las PYMEs:
- 📝 Solicitar créditos en línea
- 📎 Cargar documentos de forma segura
- ✍️ Firmar digitalmente
- 📊 Conocer el estado de su solicitud en tiempo real
- 💬 Recibir notificaciones y actualizaciones

Panel para operadores con:
- 🔍 Filtros avanzados de búsqueda
- ✅ Revisión y aprobación de solicitudes
- 📈 Dashboard con métricas
- 🔐 Verificación KYC/AML integrada

## 🛠️ Stack Tecnológico

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.21+
- **Lenguaje**: TypeScript 5.7+
- **ORM**: TypeORM 0.3.20
- **Base de Datos**: PostgreSQL 14+ (Supabase)
- **Autenticación**: JWT + Passport.js (OAuth Google)
- **Validación**: Zod
- **Documentación**: Swagger/OpenAPI
- **Storage**: Supabase Storage
- **Seguridad**: bcrypt, CORS, helmet

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18 o superior
- npm o yarn
- Cuenta de Supabase (gratuita)
- PostgreSQL (si no usas Supabase)

### 1️⃣ Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd backend
```

### 2️⃣ Instalar dependencias

```bash
npm install
```

### 3️⃣ Configurar variables de entorno

Copia el archivo de ejemplo y configura tus credenciales:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:

```env
# PostgreSQL / Supabase
DB_HOST=db.your-project.supabase.co
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu-password
DB_NAME=postgres
DB_SSL=true

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key

# JWT
JWT_SECRET=cambia-este-secreto-en-produccion
JWT_EXPIRES_IN=7d

# OAuth Google (opcional)
GOOGLE_CLIENT_ID=tu-google-client-id
GOOGLE_CLIENT_SECRET=tu-google-client-secret

# Frontend
FRONTEND_URL=http://localhost:5173
```

### 4️⃣ Configurar Supabase

1. Crea una cuenta en [Supabase](https://supabase.com)
2. Crea un nuevo proyecto
3. Ve a **Settings → API** y copia:
   - Project URL → `SUPABASE_URL`
   - anon/public key → `SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`
4. Ve a **Settings → Database** y copia:
   - Host → `DB_HOST`
   - Password → `DB_PASSWORD`
5. Crea un bucket de storage:
   - Ve a **Storage → Create Bucket**
   - Nombre: `credit-documents`
   - Public: No

### 5️⃣ Ejecutar migraciones

```bash
npm run migration:run
```

### 6️⃣ Iniciar el servidor

**Modo desarrollo** (con hot-reload):
```bash
npm run dev
```

**Modo producción**:
```bash
npm run build
npm start
```

El servidor estará disponible en:
- API: http://localhost:8082
- Documentación: http://localhost:8082/apidocs

## 📜 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia servidor en modo desarrollo con hot-reload |
| `npm run build` | Compila TypeScript a JavaScript |
| `npm start` | Ejecuta el servidor compilado (producción) |
| `npm run migration:generate` | Genera una nueva migración desde las entidades |
| `npm run migration:run` | Ejecuta migraciones pendientes |
| `npm run migration:revert` | Revierte la última migración |
| `npm run typeorm` | Ejecuta comandos de TypeORM CLI |

## 📚 Documentación

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Arquitectura completa del proyecto, modelo de datos, flujos y guías de desarrollo
- **Swagger UI** - Documentación interactiva de la API en `/apidocs`

## 🔌 Endpoints Principales

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Login
- `GET /api/auth/google` - OAuth con Google
- `GET /api/auth/profile` - Perfil del usuario (protegido)

### Empresas
- `POST /api/company` - Crear empresa
- `GET /api/company/:id` - Obtener empresa
- `PUT /api/company/:id` - Actualizar empresa

### Solicitudes de Crédito
- `POST /api/credit-application` - Crear solicitud
- `GET /api/credit-application/:id` - Obtener solicitud
- `PUT /api/credit-application/:id` - Actualizar solicitud
- `POST /api/credit-application/:id/submit` - Enviar solicitud
- `POST /api/credit-application/:id/sign` - Firmar digitalmente

### Documentos
- `POST /api/document/upload` - Subir documento
- `GET /api/document/:id` - Obtener documento
- `DELETE /api/document/:id` - Eliminar documento

### Administración
- `GET /api/admin/applications` - Listar solicitudes con filtros
- `PUT /api/admin/applications/:id/review` - Revisar solicitud
- `GET /api/admin/dashboard` - Estadísticas

## 🏗️ Estructura del Proyecto

```
backend/
├── src/
│   ├── api/                    # Módulos de la API
│   │   ├── auth/              # Autenticación
│   │   ├── company/           # Empresas
│   │   ├── credit-application/# Solicitudes
│   │   ├── document/          # Documentos
│   │   └── admin/             # Administración
│   ├── config/                # Configuraciones
│   ├── constants/             # Constantes y enums
│   ├── entities/              # Entidades TypeORM
│   ├── middleware/            # Middlewares
│   ├── utils/                 # Utilidades
│   └── index.ts               # Punto de entrada
├── .env.example               # Variables de entorno ejemplo
├── package.json               # Dependencias
├── tsconfig.json              # Configuración TypeScript
├── README.md                  # Este archivo
└── ARCHITECTURE.md            # Documentación detallada
```

## 🔐 Seguridad

- ✅ Contraseñas hasheadas con bcrypt
- ✅ Autenticación JWT
- ✅ Validación de entrada con Zod
- ✅ CORS configurado
- ✅ SQL injection protegido (TypeORM)
- ✅ Rate limiting (recomendado para producción)
- ✅ Helmet para headers de seguridad (recomendado)

## 🧪 Testing

```bash
npm test
```

## 📦 Deployment

### Variables de Entorno en Producción

Asegúrate de configurar:
- `NODE_ENV=production`
- `JWT_SECRET` con un valor seguro y único
- `DB_SSL=true` para conexiones seguras
- URLs de frontend y backend correctas

### Plataformas Recomendadas

- **Railway** - Deploy automático desde Git
- **Render** - Free tier disponible
- **Heroku** - Fácil configuración
- **AWS/GCP/Azure** - Para producción enterprise

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Funcionalidades

### Must-Have ✅
- [x] Registro de usuario y autenticación segura
- [x] Formulario dinámico que guarde avances
- [x] Carga de documentos
- [x] Firma digital
- [x] Panel de administración
- [x] Actualización de estados

### Nice-to-Have 🚀
- [ ] Pre-evaluación de riesgo con IA
- [ ] Integración con sistemas de contabilidad
- [ ] Chat de soporte (bot o humano)
- [ ] Notificaciones por email/SMS
- [ ] Dashboard con analytics

## 📄 Licencia

ISC

## 👥 Equipo

Desarrollado por el equipo de No Country

---

**¿Necesitas ayuda?** Revisa la [documentación completa](./ARCHITECTURE.md) o abre un issue.


