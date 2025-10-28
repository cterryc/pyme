"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCompanySchema = exports.getAllCompaniesQuerySchema = exports.createCompanySchema = void 0;
const zod_1 = require("zod");
const CreditStatus_1 = require("../../constants/CreditStatus");
// Validador para strings requeridos que no deben ser solo espacios
const nonEmptyString = (minLength = 1, maxLength) => {
    let schema = zod_1.z.string()
        .min(minLength, { message: 'Campo requerido' })
        .refine((val) => val.trim().length > 0, {
        message: "El campo no puede contener solo espacios en blanco",
    })
        .transform((val) => val.trim()); // Trim después de validar
    if (maxLength) {
        schema = schema.refine((val) => val.length <= maxLength, {
            message: `El campo no puede exceder ${maxLength} caracteres`,
        });
    }
    return schema;
};
// Validador para strings opcionales que si se proporcionan no deben ser solo espacios
const optionalNonEmptyString = (maxLength) => {
    let schema = zod_1.z.string()
        .optional()
        .refine((val) => {
        // Si el campo no se envía o es undefined, está bien
        if (val === undefined || val === null)
            return true;
        // Si se envía, NO debe ser solo espacios en blanco
        return val.trim().length > 0;
    }, {
        message: "El campo no puede contener solo espacios en blanco",
    })
        .transform((val) => {
        // Convertir strings vacíos a undefined, trim los demás
        if (!val || val.trim() === '')
            return undefined;
        return val.trim();
    });
    if (maxLength) {
        schema = schema.refine((val) => {
            if (!val)
                return true;
            return val.length <= maxLength;
        }, {
            message: `El campo no puede exceder ${maxLength} caracteres`,
        });
    }
    return schema;
};
exports.createCompanySchema = zod_1.z.object({
    legalName: nonEmptyString(1, 255),
    tradeName: optionalNonEmptyString(255),
    industryId: zod_1.z.string().uuid({ message: 'ID de industria inválido' }),
    taxId: nonEmptyString(1, 50),
    email: zod_1.z.string({ required_error: 'El email es requerido' })
        .min(1, { message: 'El email es requerido' })
        .refine((val) => val.trim().length > 0, {
        message: "El email no puede contener solo espacios en blanco",
    })
        .refine((val) => {
        // Validar formato de email
        return zod_1.z.string().email().safeParse(val.trim()).success;
    }, {
        message: "Email inválido",
    })
        .transform((val) => val.trim()),
    foundedDate: zod_1.z.coerce.date().optional(),
    employeeCount: zod_1.z.number()
        .int({ message: "El número de empleados debe ser un entero" })
        .min(0, { message: "El número de empleados no puede ser negativo" })
        .max(1000000, { message: "El número de empleados excede el máximo permitido" })
        .refine((val) => !isNaN(val) && isFinite(val), {
        message: "El número de empleados debe ser un número válido",
    }),
    annualRevenue: zod_1.z.number()
        .min(0, { message: "Los ingresos anuales no pueden ser negativos" })
        .refine((val) => !isNaN(val) && isFinite(val), {
        message: "Los ingresos anuales deben ser un número válido",
    }),
    address: optionalNonEmptyString(500),
    city: optionalNonEmptyString(100),
    state: optionalNonEmptyString(100),
    postalCode: optionalNonEmptyString(20),
    country: optionalNonEmptyString(50),
    phone: optionalNonEmptyString(20),
    website: zod_1.z.union([
        zod_1.z.string().refine((val) => {
            // Si se proporciona, NO debe ser solo espacios
            return val.trim().length > 0;
        }, {
            message: "La URL no puede contener solo espacios en blanco",
        }).refine((val) => {
            // Validar formato de URL
            return zod_1.z.string().url().safeParse(val.trim()).success;
        }, {
            message: "URL inválida",
        }).transform((val) => val.trim()),
        zod_1.z.literal('').transform(() => undefined),
        zod_1.z.undefined()
    ]).optional(),
    description: optionalNonEmptyString(1000),
}).strict();
exports.getAllCompaniesQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).optional().default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).optional().default(10),
    // Filtros
    industryId: zod_1.z.string().uuid().optional(),
    status: zod_1.z.nativeEnum(CreditStatus_1.CreditApplicationStatus).optional(),
    deleted: zod_1.z.enum(['true', 'false', 'all']).optional().default('false'),
    // Búsqueda
    search: zod_1.z.string().trim().min(1).optional(), // Busca en legalName y taxId
    // Filtros de fecha - createdAt
    createdAtFrom: zod_1.z.coerce.date().optional(),
    createdAtTo: zod_1.z.coerce.date().optional(),
    // Filtros de fecha - foundedDate
    foundedDateFrom: zod_1.z.coerce.date().optional(),
    foundedDateTo: zod_1.z.coerce.date().optional(),
    // Ordenamiento
    sortBy: zod_1.z.enum(['createdAt', 'legalName']).optional().default('createdAt'),
    sortOrder: zod_1.z.enum(['ASC', 'DESC']).optional().default('DESC'),
}).strict();
exports.updateCompanySchema = exports.createCompanySchema.partial();
//# sourceMappingURL=validator.js.map