# Admin API Docs

Base path: `/admin`

- Authentication: JWT requerido.
- Autorización: Rol `ADMIN` requerido.
- Header obligatorio:
```
Authorization: Bearer <TOKEN_JWT>
Content-Type: application/json
```

Formato de respuesta: `apiResponse(success: boolean, data: any)`

Archivos relacionados:
- `src/api/admin/routes.ts`
- `src/api/admin/controller.ts`
- `src/api/admin/service.ts`
- `src/api/admin/validator.ts`
- `src/api/admin/dto.ts`

---

## Industry

Entidad `Industry` (`src/entities/Industry.entity.ts`):
- `name`: string (única, min 1, max 100, se guarda en lowercase)
- `baseRiskTier`: enum `A | B | C | D`
- `description`: string (opcional)
- Campos base: `id`, `createdAt`, `updatedAt`, `deletedAt?`

DTO devuelto:
```json
{
  "id": "uuid",
  "name": "software",
  "baseRiskTier": "A",
  "description": "Tecnología y software"
}
```

### Listar todas
- Method: GET
- Path: `/admin/industries`

Curl:
```bash
curl -X GET \
  -H "Authorization: Bearer <TOKEN_JWT>" \
  http://localhost:PORT/admin/industries
```

Respuesta 200 (DTO):
```json
{
  "success": true,
  "data": [
    {
      "id": "3b4d9e0f-0a9e-4e6a-9fef-c0bdc0a5d0e6",
      "name": "software",
      "baseRiskTier": "A",
      "description": "Tecnología y software"
    }
  ]
}
```

### Crear
- Method: POST
- Path: `/admin/industries`
- Body (Zod: `createIndustrySchema`):
```json
{
  "name": "Software",
  "baseRiskTier": "A",
  "description": "Tecnología y software"
}
```

Curl:
```bash
curl -X POST \
  -H "Authorization: Bearer <TOKEN_JWT>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Software","baseRiskTier":"A","description":"Tecnología y software"}' \
  http://localhost:PORT/admin/industries
```

Respuesta 201 (DTO):
```json
{
  "success": true,
  "data": {
    "id": "3b4d9e0f-0a9e-4e6a-9fef-c0bdc0a5d0e6",
    "name": "software",
    "baseRiskTier": "A",
    "description": "Tecnología y software"
  }
}
```

### Obtener por ID
- Method: GET
- Path: `/admin/industries/:id`

Curl:
```bash
curl -X GET \
  -H "Authorization: Bearer <TOKEN_JWT>" \
  http://localhost:PORT/admin/industries/3b4d9e0f-0a9e-4e6a-9fef-c0bdc0a5d0e6
```

Respuesta 200 (DTO):
```json
{
  "success": true,
  "data": {
    "id": "3b4d9e0f-0a9e-4e6a-9fef-c0bdc0a5d0e6",
    "name": "software",
    "baseRiskTier": "A",
    "description": "Tecnología y software"
  }
}
```

### Actualizar
- Method: PATCH
- Path: `/admin/industries/:id`
- Body (Zod: `updateIndustrySchema`, todos opcionales):
```json
{
  "name": "Fintech",
  "baseRiskTier": "B"
}
```

Curl:
```bash
curl -X PATCH \
  -H "Authorization: Bearer <TOKEN_JWT>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Fintech","baseRiskTier":"B"}' \
  http://localhost:PORT/admin/industries/3b4d9e0f-0a9e-4e6a-9fef-c0bdc0a5d0e6
```

Respuesta 200 (DTO):
```json
{
  "success": true,
  "data": {
    "id": "3b4d9e0f-0a9e-4e6a-9fef-c0bdc0a5d0e6",
    "name": "fintech",
    "baseRiskTier": "B",
    "description": "Tecnología y software"
  }
}
```

### Eliminar
- Method: DELETE
- Path: `/admin/industries/:id`

Curl:
```bash
curl -X DELETE \
  -H "Authorization: Bearer <TOKEN_JWT>" \
  http://localhost:PORT/admin/industries/3b4d9e0f-0a9e-4e6a-9fef-c0bdc0a5d0e6
```

Respuesta 200:
```json
{
  "success": true,
  "data": { "message": "Eliminado" }
}
```

## SystemConfig

Entidad `SystemConfig` (`src/entities/System_config.entity.ts`):
- `key`: string (única, máx 100)
- `value`: number
- `description`: string (opcional)
- Campos base: `id` (uuid), `createdAt`, `updatedAt`, `deletedAt?`

### Listar todas
- Method: GET
- Path: `/admin/systemconfig`

Curl:
```bash
curl -X GET \
  -H "Authorization: Bearer <TOKEN_JWT>" \
  http://localhost:PORT/admin/systemconfig
```

Respuesta 200 (DTO):
```json
{
  "success": true,
  "data": [
    {
      "id": "8f1db7e3-0f5f-4a34-9d65-4b51d2be0347",
      "key": "BASE_RATE",
      "value": 20.0,
      "description": "Tasa base anual"
    }
  ]
}
```

### Crear
- Method: POST
- Path: `/admin/systemconfig`
- Body (Zod: `createSystemConfigSchema`):
```json
{
  "key": "BASE_RATE",
  "value": 20.0,
  "description": "Tasa base anual"
}
```

Curl:
```bash
curl -X POST \
  -H "Authorization: Bearer <TOKEN_JWT>" \
  -H "Content-Type: application/json" \
  -d '{"key":"BASE_RATE","value":20.0,"description":"Tasa base anual"}' \
  http://localhost:PORT/admin/systemconfig
```

Respuesta 201 (DTO):
```json
{
  "success": true,
  "data": {
    "id": "3b4d9e0f-0a9e-4e6a-9fef-c0bdc0a5d0e6",
    "key": "BASE_RATE",
    "value": 20.0,
    "description": "Tasa base anual"
  }
}
```

Errores comunes:
- 400 (validación Zod):
```json
{
  "success": false,
  "data": [
    { "path": "key", "message": "Required" }
  ]
}
```
- 400 (duplicado de key):
```json
{
  "success": false,
  "data": { "message": "La clave ya existe." }
}
```

### Obtener por ID
- Method: GET
- Path: `/admin/systemconfig/:id`
- Params: `id` (uuid)

Curl:
```bash
curl -X GET \
  -H "Authorization: Bearer <TOKEN_JWT>" \
  http://localhost:PORT/admin/systemconfig/3b4d9e0f-0a9e-4e6a-9fef-c0bdc0a5d0e6
```

Respuesta 200:
```json
{
  "success": true,
  "data": {
    "id": "3b4d9e0f-0a9e-4e6a-9fef-c0bdc0a5d0e6",
    "key": "BASE_RATE",
    "value": 20.0,
    "description": "Tasa base anual",
    "createdAt": "2025-10-22T12:10:00.000Z",
    "updatedAt": "2025-10-22T12:10:00.000Z",
    "deletedAt": null
  }
}
```

Errores:
- 400 (id inválido) y 404 (no encontrada) con el mismo formato.

### Actualizar
- Method: PATCH
- Path: `/admin/systemconfig/:id`
- Params: `id` (uuid)
- Body (Zod: `updateSystemConfigSchema`, todos opcionales):
```json
{
  "value": 21.5,
  "description": "Actualización trimestral"
}
```

Curl:
```bash
curl -X PATCH \
  -H "Authorization: Bearer <TOKEN_JWT>" \
  -H "Content-Type: application/json" \
  -d '{"value":21.5,"description":"Actualización trimestral"}' \
  http://localhost:PORT/admin/systemconfig/3b4d9e0f-0a9e-4e6a-9fef-c0bdc0a5d0e6
```

Respuesta 200:
```json
{
  "success": true,
  "data": {
    "id": "3b4d9e0f-0a9e-4e6a-9fef-c0bdc0a5d0e6",
    "key": "BASE_RATE",
    "value": 21.5,
    "description": "Actualización trimestral",
    "createdAt": "2025-10-22T12:10:00.000Z",
    "updatedAt": "2025-10-22T12:20:00.000Z",
    "deletedAt": null
  }
}
```

### Eliminar
- Method: DELETE
- Path: `/admin/systemconfig/:id`

Curl:
```bash
curl -X DELETE \
  -H "Authorization: Bearer <TOKEN_JWT>" \
  http://localhost:PORT/admin/systemconfig/3b4d9e0f-0a9e-4e6a-9fef-c0bdc0a5d0e6
```

Respuesta 200:
```json
{
  "success": true,
  "data": { "message": "Eliminado" }
}
```

---

## RiskTierConfig

Entidad `RiskTierConfig` (`src/entities/Risk_tier_config.entity.ts`):
- `tier`: enum `A | B | C | D` (único)
- `spread`: number (ej. 8.00)
- `factor`: number (ej. 0.35)
- `allowed_terms`: number[] (ej. [12, 18, 24, 36])
- Campos base: `id`, `createdAt`, `updatedAt`, `deletedAt?`

### Listar todas
- Method: GET
- Path: `/admin/risktier`

Curl:
```bash
curl -X GET \
  -H "Authorization: Bearer <TOKEN_JWT>" \
  http://localhost:PORT/admin/risktier
```

Respuesta 200 (DTO):
```json
{
  "success": true,
  "data": [
    {
      "id": "f7a7aadd-9a3a-4a07-bbf6-73b22f1d5f9b",
      "tier": "A",
      "spread": 8.0,
      "factor": 0.35,
      "allowed_terms": [12, 18, 24, 36]
    }
  ]
}
```

### Crear
- Method: POST
- Path: `/admin/risktier`
- Body (Zod: `createRiskTierConfigSchema`):
```json
{
  "tier": "A",
  "spread": 8.0,
  "factor": 0.35,
  "allowed_terms": [12, 18, 24, 36]
}
```

Curl:
```bash
curl -X POST \
  -H "Authorization: Bearer <TOKEN_JWT>" \
  -H "Content-Type: application/json" \
  -d '{"tier":"A","spread":8.0,"factor":0.35,"allowed_terms":[12,18,24,36]}' \
  http://localhost:PORT/admin/risktier
```

Respuesta 201 (DTO):
```json
{
  "success": true,
  "data": {
    "id": "4b3f5a71-2edc-4a8f-8f91-3b298baf4a9e",
    "tier": "A",
    "spread": 8.0,
    "factor": 0.35,
    "allowed_terms": [12, 18, 24, 36]
  }
}
```

### Obtener por ID
- Method: GET
- Path: `/admin/risktier/:id`

Curl:
```bash
curl -X GET \
  -H "Authorization: Bearer <TOKEN_JWT>" \
  http://localhost:PORT/admin/risktier/4b3f5a71-2edc-4a8f-8f91-3b298baf4a9e
```

Respuesta 200:
```json
{
  "success": true,
  "data": {
    "id": "4b3f5a71-2edc-4a8f-8f91-3b298baf4a9e",
    "tier": "A",
    "spread": 8.0,
    "factor": 0.35,
    "allowed_terms": [12, 18, 24, 36],
    "createdAt": "2025-10-22T12:10:00.000Z",
    "updatedAt": "2025-10-22T12:10:00.000Z",
    "deletedAt": null
  }
}
```

### Actualizar
- Method: PATCH
- Path: `/admin/risktier/:id`
- Body (Zod: `updateRiskTierConfigSchema`, todos opcionales):
```json
{
  "spread": 8.5,
  "allowed_terms": [12, 24, 36]
}
```

Curl:
```bash
curl -X PATCH \
  -H "Authorization: Bearer <TOKEN_JWT>" \
  -H "Content-Type: application/json" \
  -d '{"spread":8.5,"allowed_terms":[12,24,36]}' \
  http://localhost:PORT/admin/risktier/4b3f5a71-2edc-4a8f-8f91-3b298baf4a9e
```

Respuesta 200:
```json
{
  "success": true,
  "data": {
    "id": "4b3f5a71-2edc-4a8f-8f91-3b298baf4a9e",
    "tier": "A",
    "spread": 8.5,
    "factor": 0.35,
    "allowed_terms": [12, 24, 36],
    "createdAt": "2025-10-22T12:10:00.000Z",
    "updatedAt": "2025-10-22T12:25:00.000Z",
    "deletedAt": null
  }
}
```

### Eliminar
- Method: DELETE
- Path: `/admin/risktier/:id`

Curl:
```bash
curl -X DELETE \
  -H "Authorization: Bearer <TOKEN_JWT>" \
  http://localhost:PORT/admin/risktier/4b3f5a71-2edc-4a8f-8f91-3b298baf4a9e
```

Respuesta 200:
```json
{
  "success": true,
  "data": { "message": "Eliminado" }
}
```
