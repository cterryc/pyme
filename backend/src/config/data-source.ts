import 'reflect-metadata'
import { DataSource } from 'typeorm'
import config from './enviroment.config'

const isProd = process.env.NODE_ENV === 'production'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.DB_HOST,
  port: config.DB_PORT,
  username: config.DB_USERNAME,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  ssl: config.DB_SSL
    ? {
        rejectUnauthorized: false,
      }
    : false,
  synchronize: !isProd,
  logging: !isProd,
  entities: [isProd ? 'dist/entities/**/*.js' : 'src/entities/**/*.ts'],
  migrations: [isProd ? 'dist/migrations/**/*.js' : 'src/migrations/**/*.ts'],
  subscribers: [isProd ? 'dist/subscribers/**/*.js' : 'src/subscribers/**/*.ts'],
  extra: {
    // Connection pooling optimizado para Supabase
    max: isProd ? 10 : 20, // Menos conexiones en producción
    min: isProd ? 2 : 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000, // 10 segundos en lugar de 2
    query_timeout: 20000, // 20 segundos para queries
    statement_timeout: 20000, // 20 segundos para statements
  },
  //   dropSchema: true,
})
