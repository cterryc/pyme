/**
 * Valida que las variables de entorno críticas estén configuradas correctamente en producción
 * Lanza un error si falta alguna variable o si contiene valores inseguros
 */
export function validateProductionEnv(): void {
    if (process.env.NODE_ENV !== 'production') {
        console.log('[ENV] Environment: Development - Skipping strict validation');
        return;
    }

    console.log('[ENV] Validating production environment variables...');

    // Variables críticas que deben estar presentes
    const requiredVars = [
        'JWT_SECRET',
        'DB_PASSWORD',
        'DB_HOST',
        'SUPABASE_URL',
        'SUPABASE_SERVICE_ROLE_KEY',
        'FRONTEND_URL',
    ];

    // Valores inseguros que no deben aparecer en producción
    const insecureValues = [
        'change-this-secret',
        'your-',
        '12345',
        'localhost',
        'example',
        'test',
    ];

    const errors: string[] = [];

    // Validar que existan las variables requeridas
    requiredVars.forEach((varName) => {
        const value = process.env[varName];

        if (!value) {
            errors.push(`❌ ${varName} is not defined`);
            return;
        }

        // Validar que no contengan valores inseguros
        const hasInsecureValue = insecureValues.some((insecure) =>
            value.toLowerCase().includes(insecure)
        );

        if (hasInsecureValue) {
            errors.push(`❌ ${varName} contains insecure default value`);
        }

        // Validar longitud mínima para secretos
        if (['JWT_SECRET', 'SESSION_KEY'].includes(varName) && value.length < 32) {
            errors.push(`❌ ${varName} should be at least 32 characters long (current: ${value.length})`);
        }
    });

    // Validar NODE_ENV
    if (process.env.NODE_ENV !== 'production') {
        errors.push(`❌ NODE_ENV must be 'production' (current: ${process.env.NODE_ENV})`);
    }

    // Validar DB_SSL
    if (process.env.DB_SSL !== 'true') {
        errors.push(`⚠️ DB_SSL should be 'true' in production (current: ${process.env.DB_SSL})`);
    }

    // Si hay errores, lanzar excepción
    if (errors.length > 0) {
        const errorMessage = '\n' + errors.join('\n');
        console.error('[ENV] Environment validation failed:', errors);
        throw new Error(`Production environment validation failed:${errorMessage}`);
    }

    console.log('[ENV] ✅ All environment variables validated successfully');
}

/**
 * Valida configuración de CORS en producción
 */
export function validateCORSConfig(): void {
    if (process.env.NODE_ENV !== 'production') return;

    const frontendUrl = process.env.FRONTEND_URL;

    if (!frontendUrl) {
        throw new Error('FRONTEND_URL must be defined in production');
    }

    if (frontendUrl.includes('localhost')) {
        throw new Error('FRONTEND_URL cannot contain "localhost" in production');
    }

    if (!frontendUrl.startsWith('https://')) {
        console.warn('[ENV] ⚠️ FRONTEND_URL should use HTTPS in production');
    }

    console.log('[ENV] ✅ CORS configuration validated');
}

/**
 * Validación completa del entorno
 */
export function validateEnvironment(): void {
    try {
        validateProductionEnv();
        validateCORSConfig();
        console.log('[ENV] 🚀 Environment validation complete - Ready for production');
    } catch (error) {
        console.error('[ENV] ❌ Environment validation failed:', error);
        process.exit(1);
    }
}
