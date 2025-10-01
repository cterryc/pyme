# 🏗️ Arquitectura del Proyecto - Plataforma de Créditos para PYMEs

## 📋 Tabla de Contenidos

1. [Visión General](#visión-general)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Estructura de Directorios](#estructura-de-directorios)
4. [Arquitectura de Capas](#arquitectura-de-capas)
5. [Modelo de Datos](#modelo-de-datos)
6. [Módulos de la API](#módulos-de-la-api)
7. [Flujo de Autenticación](#flujo-de-autenticación)
8. [Flujo de Solicitud de Crédito](#flujo-de-solicitud-de-crédito)
9. [Configuración y Variables de Entorno](#configuración-y-variables-de-entorno)
10. [Guía de Desarrollo](#guía-de-desarrollo)

---

## 🎯 Visión General

Esta es una plataforma backend para gestión de solicitudes de crédito para PYMEs (Pequeñas y Medianas Empresas). El sistema permite:

- **Registro y autenticación** de usuarios (empresas, operadores, administradores)
- **Solicitud de créditos** con formularios dinámicos que guardan progreso
- **Carga y gestión de documentos** con almacenamiento en Supabase
- **Verificación KYC/AML** (Know Your Customer / Anti-Money Laundering)
- **Firma digital** de documentos
- **Panel de administración** para revisar y aprobar solicitudes
- **Seguimiento en tiempo real** del estado de las solicitudes

---

## 🛠️ Stack Tecnológico

### Backend
- **Node.js** v18+
- **TypeScript** 5.7+
- **Express.js** 4.21+ - Framework web
- **TypeORM** 0.3.20 - ORM para PostgreSQL

### Base de Datos
- **PostgreSQL** 14+ - Base de datos principal
- **Supabase** - Plataforma BaaS (Backend as a Service)
  - PostgreSQL gestionado
  - Storage para documentos
  - Autenticación (opcional)

### Autenticación y Seguridad
- **JWT** (JSON Web Tokens) - Autenticación stateless
- **bcrypt** - Hash de contraseñas
- **Passport.js** - Estrategias OAuth (Google)

### Validación y Documentación
- **Zod** - Validación de esquemas
- **Swagger/OpenAPI** - Documentación de API

### Utilidades
- **Multer** - Carga de archivos
- **dotenv** - Variables de entorno
- **cors** - Cross-Origin Resource Sharing

---

## 📁 Estructura de Directorios

```
backend/
├── src/
│   ├── api/                          # Módulos de la API (por dominio)
│   │   ├── auth/                     # Autenticación y autorización
│   │   │   ├── controller.ts         # Controladores HTTP
│   │   │   ├── service.ts            # Lógica de negocio
│   │   │   ├── routes.ts             # Definición de rutas
│   │   │   ├── interface.ts          # Interfaces TypeScript
│   │   │   └── validator.ts          # Validadores Zod
│   │   ├── company/                  # Gestión de empresas
│   │   ├── credit-application/       # Solicitudes de crédito
│   │   ├── document/                 # Gestión de documentos
│   │   ├── kyc/                      # Verificación KYC/AML
│   │   └── admin/                    # Panel de administración
│   │
│   ├── config/                       # Configuraciones
│   │   ├── data-source.ts            # Configuración TypeORM
│   │   ├── supabase.config.ts        # Cliente Supabase
│   │   ├── passport.config.ts        # Estrategias OAuth
│   │   ├── middlewares.config.ts     # Middlewares globales
│   │   ├── enviroment.config.ts      # Variables de entorno
│   │   └── createApp.ts              # Creación de app Express
│   │
│   ├── constants/                    # Constantes y enums
│   │   ├── Roles.ts                  # Roles de usuario
│   │   ├── CreditStatus.ts           # Estados de solicitudes
│   │   └── HttpStatus.ts             # Códigos HTTP
│   │
│   ├── db/                           # Gestión de base de datos
│   │   └── typeormManager.ts         # Manager de conexión
│   │
│   ├── docs/                         # Documentación Swagger
│   │   ├── auth/                     # Docs de autenticación
│   │   ├── credit-application/       # Docs de solicitudes
│   │   └── ...
│   │
│   ├── entities/                     # Entidades TypeORM
│   │   ├── BaseEntity.ts             # Entidad base (timestamps, soft delete)
│   │   ├── User.entity.ts            # Usuarios del sistema
│   │   ├── Company.entity.ts         # Empresas/PYMEs
│   │   ├── CreditApplication.entity.ts  # Solicitudes de crédito
│   │   ├── Document.entity.ts        # Documentos adjuntos
│   │   ├── AuditLog.entity.ts        # Logs de auditoría
│   │   └── index.ts                  # Exportaciones
│   │
│   ├── interfaces/                   # Interfaces globales
│   │   ├── config.interface.ts       # Configuración
│   │   └── file.interface.ts         # Archivos
│   │
│   ├── middleware/                   # Middlewares
│   │   ├── authenticate.middleware.ts    # Verificación JWT
│   │   ├── authorization.middleware.ts   # Control de acceso por rol
│   │   └── schemaValidators.middlewares.ts  # Validación Zod
│   │
│   ├── migrations/                   # Migraciones de base de datos
│   │
│   ├── routers/                      # Router principal
│   │   └── index.ts                  # Agregador de rutas
│   │
│   ├── utils/                        # Utilidades
│   │   ├── bcrypt.utils.ts           # Hash de contraseñas
│   │   ├── jwt.utils.ts              # Generación/verificación JWT
│   │   ├── HttpError.utils.ts        # Clase de error HTTP
│   │   ├── apiResponse.utils.ts      # Formato de respuestas
│   │   └── path.utils.ts             # Utilidades de rutas
│   │
│   └── index.ts                      # Punto de entrada
│
├── dist/                             # Código compilado (generado)
├── node_modules/                     # Dependencias
├── .env                              # Variables de entorno (no versionado)
├── .env.example                      # Ejemplo de variables
├── package.json                      # Dependencias y scripts
├── tsconfig.json                     # Configuración TypeScript
├── README.md                         # Documentación principal
└── ARCHITECTURE.md                   # Este archivo
```

---

## 🏛️ Arquitectura de Capas

El proyecto sigue una arquitectura en capas (Layered Architecture) con separación de responsabilidades:

```
┌─────────────────────────────────────────┐
│         HTTP REQUEST (Cliente)          │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  ROUTES (routes.ts)                     │
│  - Definición de endpoints              │
│  - Aplicación de middlewares            │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  MIDDLEWARES                            │
│  - Autenticación (JWT)                  │
│  - Autorización (Roles)                 │
│  - Validación (Zod)                     │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  CONTROLLERS (controller.ts)            │
│  - Manejo de Request/Response           │
│  - Validación de entrada                │
│  - Manejo de errores HTTP               │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  SERVICES (service.ts)                  │
│  - Lógica de negocio                    │
│  - Orquestación de operaciones          │
│  - Validaciones de negocio              │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  REPOSITORIES (TypeORM)                 │
│  - Acceso a datos                       │
│  - Queries a base de datos              │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  DATABASE (PostgreSQL/Supabase)         │
└─────────────────────────────────────────┘
```

### Responsabilidades por Capa

#### 1. **Routes** (`routes.ts`)
- Define los endpoints HTTP (GET, POST, PUT, DELETE)
- Aplica middlewares específicos de ruta
- No contiene lógica de negocio

#### 2. **Middlewares**
- **authenticate**: Verifica token JWT
- **authorization**: Verifica permisos por rol
- **schemaValidator**: Valida payload con Zod

#### 3. **Controllers** (`controller.ts`)
- Recibe Request, envía Response
- Extrae datos del request
- Llama a servicios
- Formatea respuestas
- Maneja errores HTTP

#### 4. **Services** (`service.ts`)
- Contiene la lógica de negocio
- Interactúa con repositorios (TypeORM)
- Realiza validaciones de negocio
- Orquesta operaciones complejas

#### 5. **Entities** (`*.entity.ts`)
- Define el modelo de datos
- Mapea a tablas de PostgreSQL
- Define relaciones entre entidades

---

## 🗄️ Modelo de Datos

### Diagrama de Relaciones

```
┌─────────────┐
│    User     │
│─────────────│
│ id (PK)     │
│ email       │◄────────┐
│ password    │         │
│ firstName   │         │
│ lastName    │         │
│ role        │         │
│ googleId    │         │
└──────┬──────┘         │
       │                │
       │ 1:N            │
       │                │
┌──────▼──────┐         │
│   Company   │         │
│─────────────│         │
│ id (PK)     │         │
│ legalName   │         │
│ taxId       │         │
│ ownerId(FK) │─────────┘
│ industry    │
│ revenue     │
└──────┬──────┘
       │
       │ 1:N
       │
┌──────▼────────────────┐
│  CreditApplication    │
│───────────────────────│
│ id (PK)               │
│ applicationNumber     │
│ companyId (FK)        │───┐
│ requestedAmount       │   │
│ status                │   │
│ kycStatus             │   │
│ formData (JSONB)      │   │
│ digitalSignature      │   │
│ reviewedById (FK)     │───┼──► User
└──────┬────────────────┘   │
       │                    │
       │ 1:N                │
       │                    │
┌──────▼──────┐             │
│  Document   │             │
│─────────────│             │
│ id (PK)     │             │
│ type        │             │
│ fileUrl     │             │
│ status      │             │
│ creditAppId │─────────────┘
│ uploadedBy  │───► User
│ reviewedBy  │───► User
└─────────────┘

┌─────────────┐
│  AuditLog   │
│─────────────│
│ id (PK)     │
│ action      │
│ entityType  │
│ entityId    │
│ userId (FK) │───► User
│ oldValues   │
│ newValues   │
└─────────────┘
```

### Entidades Principales

#### **User**
Usuarios del sistema (empresas, operadores, administradores)

```typescript
{
  id: UUID
  email: string (unique)
  password: string (hashed)
  firstName: string
  lastName: string
  phone?: string
  role: UserRole (ADMIN | COMPANY | OPERATOR)
  isEmailVerified: boolean
  isActive: boolean
  googleId?: string
  profileImage?: string
  lastLogin?: Date
}
```

#### **Company**
Información de las PYMEs

```typescript
{
  id: UUID
  legalName: string
  tradeName?: string
  taxId: string (unique) // RFC, CUIT
  industry?: string
  foundedDate?: Date
  employeeCount?: number
  annualRevenue?: Decimal
  address?: string
  city?: string
  state?: string
  country?: string
  ownerId: UUID (FK → User)
}
```

#### **CreditApplication**
Solicitudes de crédito

```typescript
{
  id: UUID
  applicationNumber: string (unique)
  companyId: UUID (FK → Company)
  requestedAmount: Decimal
  purpose: string
  termMonths: number
  status: CreditApplicationStatus
  kycStatus: KYCStatus
  completionPercentage: number (0-100)
  approvedAmount?: Decimal
  interestRate?: Decimal
  rejectionReason?: string
  riskScore?: number (0-100)
  formData?: JSONB // Datos dinámicos del formulario
  digitalSignature?: string
  submittedAt?: Date
  reviewedAt?: Date
  reviewedById?: UUID (FK → User)
}
```

#### **Document**
Documentos adjuntos a solicitudes

```typescript
{
  id: UUID
  creditApplicationId: UUID (FK)
  type: DocumentType
  fileName: string
  fileUrl: string // URL en Supabase Storage
  storagePath?: string
  mimeType?: string
  fileSize?: number
  status: DocumentStatus
  rejectionReason?: string
  uploadedById?: UUID (FK → User)
  reviewedById?: UUID (FK → User)
}
```

### Estados y Enumeraciones

#### **UserRole**
```typescript
enum UserRole {
  ADMIN = "Admin",      // Administrador del sistema
  COMPANY = "Company",  // Empresa/PYME
  OPERATOR = "Operator" // Operador que revisa solicitudes
}
```

#### **CreditApplicationStatus**
```typescript
enum CreditApplicationStatus {
  DRAFT = "Draft",                      // Borrador
  SUBMITTED = "Submitted",              // Enviada
  UNDER_REVIEW = "Under Review",        // En revisión
  DOCUMENTS_REQUIRED = "Documents Required",
  KYC_PENDING = "KYC Pending",
  KYC_APPROVED = "KYC Approved",
  KYC_REJECTED = "KYC Rejected",
  APPROVED = "Approved",                // Aprobada
  REJECTED = "Rejected",                // Rechazada
  DISBURSED = "Disbursed",              // Desembolsada
  CANCELLED = "Cancelled"               // Cancelada
}
```

#### **DocumentType**
```typescript
enum DocumentType {
  ID_DOCUMENT = "ID Document",
  PROOF_OF_ADDRESS = "Proof of Address",
  TAX_RETURN = "Tax Return",
  FINANCIAL_STATEMENT = "Financial Statement",
  BANK_STATEMENT = "Bank Statement",
  BUSINESS_LICENSE = "Business License",
  ARTICLES_OF_INCORPORATION = "Articles of Incorporation",
  OTHER = "Other"
}
```

---

## 🔌 Módulos de la API

### 1. **Auth Module** (`/api/auth`)

Gestión de autenticación y autorización.

**Endpoints:**
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Login con email/password
- `GET /api/auth/google` - Iniciar OAuth con Google
- `GET /api/auth/google/callback` - Callback de Google
- `GET /api/auth/profile` - Obtener perfil del usuario autenticado (protegido)

**Archivos:**
- `controller.ts` - Maneja requests HTTP
- `service.ts` - Lógica de autenticación, hash de passwords, generación de JWT
- `routes.ts` - Define endpoints
- `interface.ts` - Tipos TypeScript
- `validator.ts` - Validación con Zod

### 2. **Company Module** (`/api/company`)

Gestión de empresas/PYMEs.

**Endpoints:**
- `POST /api/company` - Crear empresa
- `GET /api/company/:id` - Obtener empresa
- `PUT /api/company/:id` - Actualizar empresa
- `GET /api/company` - Listar empresas del usuario

### 3. **Credit Application Module** (`/api/credit-application`)

Gestión de solicitudes de crédito.

**Endpoints:**
- `POST /api/credit-application` - Crear solicitud (borrador)
- `GET /api/credit-application/:id` - Obtener solicitud
- `PUT /api/credit-application/:id` - Actualizar solicitud
- `POST /api/credit-application/:id/submit` - Enviar solicitud
- `POST /api/credit-application/:id/sign` - Firmar digitalmente
- `GET /api/credit-application` - Listar solicitudes

**Características:**
- Guardado automático de progreso
- Cálculo de porcentaje de completitud
- Validación de campos requeridos antes de envío

### 4. **Document Module** (`/api/document`)

Gestión de documentos.

**Endpoints:**
- `POST /api/document/upload` - Subir documento
- `GET /api/document/:id` - Obtener documento
- `DELETE /api/document/:id` - Eliminar documento
- `PUT /api/document/:id/review` - Revisar documento (aprobar/rechazar)

**Integración:**
- Almacenamiento en Supabase Storage
- Validación de tipo y tamaño de archivo
- Generación de URLs firmadas

### 5. **KYC Module** (`/api/kyc`)

Verificación de identidad (KYC/AML).

**Endpoints:**
- `POST /api/kyc/verify` - Iniciar verificación KYC
- `GET /api/kyc/status/:applicationId` - Estado de verificación
- `POST /api/kyc/webhook` - Webhook de proveedor KYC

### 6. **Admin Module** (`/api/admin`)

Panel de administración para operadores.

**Endpoints:**
- `GET /api/admin/applications` - Listar solicitudes con filtros
- `PUT /api/admin/applications/:id/review` - Revisar solicitud
- `GET /api/admin/dashboard` - Estadísticas del dashboard
- `GET /api/admin/audit-logs` - Logs de auditoría

---

## 🔐 Flujo de Autenticación

### 1. Registro de Usuario

```
Cliente                    Backend                    Database
  │                          │                          │
  │─── POST /auth/register ──►│                          │
  │    {email, password}     │                          │
  │                          │                          │
  │                          │─── Validar datos ────►   │
  │                          │                          │
  │                          │─── Hash password ────►   │
  │                          │                          │
  │                          │─── INSERT User ──────────►│
  │                          │                          │
  │                          │◄─── User creado ─────────│
  │                          │                          │
  │                          │─── Generar JWT ──────►   │
  │                          │                          │
  │◄─── 201 Created ─────────│                          │
  │    {user, token}         │                          │
```

### 2. Login

```
Cliente                    Backend                    Database
  │                          │                          │
  │─── POST /auth/login ─────►│                          │
  │    {email, password}     │                          │
  │                          │                          │
  │                          │─── SELECT User ──────────►│
  │                          │                          │
  │                          │◄─── User ────────────────│
  │                          │                          │
  │                          │─── Verificar password ───►│
  │                          │                          │
  │                          │─── Generar JWT ──────►   │
  │                          │                          │
  │◄─── 200 OK ──────────────│                          │
  │    {user, token}         │                          │
```

### 3. Request Autenticado

```
Cliente                    Backend                    Database
  │                          │                          │
  │─── GET /auth/profile ────►│                          │
  │    Header: Authorization │                          │
  │    Bearer <JWT>          │                          │
  │                          │                          │
  │                          │─── Verificar JWT ────►   │
  │                          │                          │
  │                          │─── SELECT User ──────────►│
  │                          │                          │
  │                          │◄─── User ────────────────│
  │                          │                          │
  │◄─── 200 OK ──────────────│                          │
  │    {user data}           │                          │
```

---

## 📝 Flujo de Solicitud de Crédito

### Flujo Completo

```
1. REGISTRO/LOGIN
   └─► Usuario se registra o inicia sesión

2. CREAR EMPRESA (si no existe)
   └─► POST /api/company
       - Información legal de la PYME

3. CREAR SOLICITUD (Borrador)
   └─► POST /api/credit-application
       - Monto solicitado
       - Propósito del crédito
       - Estado: DRAFT

4. COMPLETAR FORMULARIO
   └─► PUT /api/credit-application/:id
       - Guardar progreso automáticamente
       - formData (JSONB) almacena datos dinámicos
       - Calcular completionPercentage

5. SUBIR DOCUMENTOS
   └─► POST /api/document/upload
       - Identificación
       - Estados financieros
       - Declaraciones de impuestos
       - Licencias comerciales

6. FIRMAR DIGITALMENTE
   └─► POST /api/credit-application/:id/sign
       - Firma electrónica
       - Timestamp de firma

7. ENVIAR SOLICITUD
   └─► POST /api/credit-application/:id/submit
       - Validar campos requeridos
       - Validar documentos mínimos
       - Estado: SUBMITTED
       - Iniciar proceso KYC

8. VERIFICACIÓN KYC
   └─► Sistema automático o manual
       - Verificación de identidad
       - Verificación de empresa
       - Estado: KYC_PENDING → KYC_APPROVED/REJECTED

9. REVISIÓN POR OPERADOR
   └─► PUT /api/admin/applications/:id/review
       - Revisar documentos
       - Calcular riskScore
       - Estado: UNDER_REVIEW

10. DECISIÓN
    └─► Aprobar o Rechazar
        - APPROVED: Definir monto y tasa
        - REJECTED: Indicar razón

11. DESEMBOLSO
    └─► Estado: DISBURSED
        - Integración con sistema de pagos
```

### Estados de la Solicitud

```
DRAFT ──► SUBMITTED ──► UNDER_REVIEW ──► APPROVED ──► DISBURSED
  │           │              │              │
  │           │              │              └──► REJECTED
  │           │              │
  │           │              └──► DOCUMENTS_REQUIRED
  │           │
  │           └──► KYC_PENDING ──► KYC_APPROVED
  │                    │
  │                    └──► KYC_REJECTED
  │
  └──► CANCELLED
```

---

## ⚙️ Configuración y Variables de Entorno

### Archivo `.env`

```bash
# PostgreSQL / Supabase Database
DB_HOST=db.your-project.supabase.co
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your-database-password
DB_NAME=postgres
DB_SSL=true

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_STORAGE_BUCKET=credit-documents

# Express
PORT=8082
NODE_ENV=development
MODE=FORK  # FORK o CLUSTER

# JWT
JWT_SECRET=your-jwt-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:8082/api/auth/google/callback

# Frontend URL
FRONTEND_URL=http://localhost:5173

# File Upload
MAX_FILE_SIZE=10485760  # 10MB

# KYC/AML (Opcional)
KYC_API_KEY=your-kyc-provider-api-key
KYC_API_URL=https://api.kyc-provider.com
```

### Configuración de Supabase

1. **Crear proyecto en Supabase**
   - https://supabase.com

2. **Obtener credenciales**
   - Project Settings → API
   - Copiar URL y Keys

3. **Configurar Storage**
   - Storage → Create Bucket: `credit-documents`
   - Configurar políticas de acceso (RLS)

4. **Ejecutar migraciones**
   ```bash
   npm run migration:run
   ```

---

## 🚀 Guía de Desarrollo

### Instalación

```bash
# 1. Clonar repositorio
git clone <repo-url>
cd backend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# 4. Ejecutar migraciones
npm run migration:run

# 5. Iniciar en desarrollo
npm run dev
```

### Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor con hot-reload

# Producción
npm run build        # Compila TypeScript
npm start            # Inicia servidor compilado

# Base de datos
npm run migration:generate  # Genera migración desde entidades
npm run migration:run       # Ejecuta migraciones pendientes
npm run migration:revert    # Revierte última migración

# TypeORM CLI
npm run typeorm -- <comando>
```

### Crear un Nuevo Módulo

1. **Crear directorio del módulo**
   ```bash
   mkdir src/api/mi-modulo
   ```

2. **Crear archivos base**
   ```
   src/api/mi-modulo/
   ├── interface.ts      # Interfaces TypeScript
   ├── validator.ts      # Validadores Zod
   ├── service.ts        # Lógica de negocio
   ├── controller.ts     # Controladores HTTP
   └── routes.ts         # Rutas Express
   ```

3. **Registrar rutas**
   ```typescript
   // src/routers/index.ts
   import miModuloRouter from "../api/mi-modulo/routes";
   
   apiRouter.use("/mi-modulo", miModuloRouter);
   ```

### Crear una Nueva Entidad

1. **Crear archivo de entidad**
   ```typescript
   // src/entities/MiEntidad.entity.ts
   import { Entity, Column } from "typeorm";
   import { BaseEntity } from "./BaseEntity";
   
   @Entity("mi_tabla")
   export class MiEntidad extends BaseEntity {
       @Column()
       nombre!: string;
   }
   ```

2. **Exportar entidad**
   ```typescript
   // src/entities/index.ts
   export { MiEntidad } from "./MiEntidad.entity";
   ```

3. **Generar migración**
   ```bash
   npm run migration:generate -- src/migrations/CreateMiEntidad
   ```

4. **Ejecutar migración**
   ```bash
   npm run migration:run
   ```

### Estructura de un Endpoint

```typescript
// 1. Interface (interface.ts)
export interface ICreatePayload {
    nombre: string;
    descripcion?: string;
}

// 2. Validator (validator.ts)
export const createPayloadValidator = z.object({
    nombre: z.string().min(3),
    descripcion: z.string().optional(),
});

// 3. Service (service.ts)
export class MiService {
    async create(payload: ICreatePayload) {
        // Lógica de negocio
        const entity = repository.create(payload);
        return await repository.save(entity);
    }
}

// 4. Controller (controller.ts)
export class MiController {
    static async create(req: Request, res: Response) {
        try {
            const payload = req.body;
            const result = await miService.create(payload);
            res.status(HttpStatus.CREATED).json(apiResponse(true, result));
        } catch (err: any) {
            res.status(err.status || 500).json(apiResponse(false, err.message));
        }
    }
}

// 5. Routes (routes.ts)
const router = Router();
router.post(
    "/",
    authenticate,
    schemaValidator(createPayloadValidator, null),
    MiController.create
);
```

### Buenas Prácticas

1. **Separación de responsabilidades**
   - Controllers: Solo HTTP
   - Services: Lógica de negocio
   - Repositories: Acceso a datos

2. **Validación en capas**
   - Zod en routes (validación de entrada)
   - Validaciones de negocio en services

3. **Manejo de errores**
   - Usar `HttpError` para errores controlados
   - Try-catch en controllers
   - Logs de errores

4. **Seguridad**
   - Nunca exponer contraseñas
   - Validar permisos en cada endpoint
   - Sanitizar inputs

5. **TypeScript**
   - Tipar todo explícitamente
   - Usar interfaces para contratos
   - Evitar `any`

---

## 📚 Recursos Adicionales

- **TypeORM**: https://typeorm.io/
- **Supabase**: https://supabase.com/docs
- **Express**: https://expressjs.com/
- **Zod**: https://zod.dev/
- **JWT**: https://jwt.io/

---

## 🤝 Contribución

Para contribuir al proyecto:

1. Crear una rama feature: `git checkout -b feature/mi-feature`
2. Commit cambios: `git commit -m 'Add: mi feature'`
3. Push a la rama: `git push origin feature/mi-feature`
4. Crear Pull Request

---

## 📄 Licencia

ISC

---

**Última actualización**: 2025-09-30
