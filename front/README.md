# 🏦 Plataforma de Créditos para PYMEs - Frontend

Aplicación web en React/TypeScript que consume la API REST para la gestión de solicitudes de crédito de PYMEs, permitiendo registro, inicio de sesión, carga de documentos, seguimiento de solicitudes y firma digital.

## 🛠️ Stack Tecnológico

- **Librería**:  React 19+
- **Lenguaje**: TypeScript 5.7+
- **Ruteo**: React Router DOM 7+
- **Gestión de Formularios**: React Hook Form +  @hookform/resolvers
- **Gestión de Estado**: Datos Remotos: React Query 5+
- **Validación**: Zod
- **UI/Estilos**: TailwindCSS 4+
- **Iconos**: react-icons 5+

## 🏗️ Estructura del Proyecto

```
front/
├── public/
│   └── assets/                # Imagenes publicas 
├── src/
│   ├── components/         # Componentes reutilizables
│   ├── helpers/            # Funciones auxiliares
│   ├── hooks/              # Custom hooks (ej. useAuth, useForm)
│   ├── interfaces/         # Tipos e interfaces TypeScript
│   ├── pages/              # Páginas principales (Login, Dashboard, etc.)
│   ├── routes/             # Configuración de rutas con React Router
│   ├── schemas/            # Validaciones con Zod
│   └── services/           # Llamadas a la API y lógica de negocio
├── index.css               # Estilos globales
├── main.tsx                # Entrada principal de React
├── .env.example            # Variables de entorno ejemplo
├── package.json            # Dependencias
├── tsconfig.json           # Configuración TypeScript
└── README.md               # Este archivo
```

## 🔐 Seguridad

- ✅ Validación de formularios con Zod antes de enviar datos.
- ✅ Manejo de tokens JWT para autenticación (simulados o reales).
- ✅ React Query para cache de datos y sincronización automática

## 📜 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia en modo desarrollo |
| `npm run build` | Compila TypeScript a JavaScript |
| `npm start` | Ejecuta el compilado (producción) |

## 📦 Deployment

### Variables de Entorno en Producción

Asegúrate de configurar:
- `VITE_API_URL` uri del backend para los endpoints

### Plataformas Recomendadas

- **Netlify** - Deploy gratuito de la web

## 📄 Licencia

ISC

## 👥 Equipo

Desarrollado por el equipo de No Country

---

**Última actualización**: 2025-10-02