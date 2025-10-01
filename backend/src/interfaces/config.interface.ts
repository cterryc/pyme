export interface Config {
    // Server
    PORT: string;
    NODE_ENV: string;
    MODE: string;
    
    // Database
    DB_HOST: string;
    DB_PORT: number;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    DB_SSL: boolean;
    
    // Supabase
    SUPABASE_URL: string;
    SUPABASE_ANON_KEY: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
    SUPABASE_STORAGE_BUCKET: string;
    
    // JWT
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    SESSION_KEY: string;
    
    // OAuth
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    GOOGLE_CALLBACK_URL: string;
    
    // Frontend
    FRONTEND_URL: string;
    
    // File Upload
    MAX_FILE_SIZE: number;
    
    // KYC/AML
    KYC_API_KEY: string;
    KYC_API_URL: string;
}
