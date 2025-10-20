import { z } from "zod";
import { CreditApplicationStatus } from "../../constants/CreditStatus";

/**
 * Schema para listar solicitudes de crédito con paginación y filtros
 */
export const listCreditApplicationsAdminSchema = z.object({
  query: z.object({
    // Paginación
    page: z.string().optional().default("1").transform(Number),
    limit: z.string().optional().default("10").transform(Number),
    
    // Ordenamiento
    sortBy: z.enum(["createdAt", "submittedAt", "selectedAmount", "status"]).optional().default("createdAt"),
    sortOrder: z.enum(["ASC", "DESC"]).optional().default("DESC"),
    
    // Filtros
    status: z.nativeEnum(CreditApplicationStatus).optional(),
    companyId: z.string().uuid().optional(),
    applicationNumber: z.string().optional(),
    minAmount: z.string().optional().transform(Number),
    maxAmount: z.string().optional().transform(Number),
    
    // Búsqueda general
    search: z.string().optional(),
    
    // Filtro por fechas
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  }).optional(),
});

/**
 * Schema para actualizar el estado de una solicitud de crédito
 */
export const updateCreditApplicationStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID de aplicación inválido"),
  }),
  body: z.object({
    status: z.nativeEnum(CreditApplicationStatus, {
      required_error: "El estado es requerido",
    }),
    reason: z.string().max(1000, "La razón no puede exceder 1000 caracteres").optional(),
    internalNotes: z.string().max(2000, "Las notas internas no pueden exceder 2000 caracteres").optional(),
    approvedAmount: z.number().positive("El monto aprobado debe ser positivo").optional(),
    riskScore: z.number().min(0).max(100, "El risk score debe estar entre 0 y 100").optional(),
  }),
}).optional();

/**
 * Schema para obtener detalles de una solicitud de crédito
 */
export const getCreditApplicationDetailsSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID de aplicación inválido"),
  }),
}).optional();
