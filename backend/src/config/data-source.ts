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
  ssl: config.DB_SSL ? { rejectUnauthorized: false } : false,
  synchronize: true, // Auto-sync in dev only, disabled in production
  logging: false,
  entities: [isProd ? 'dist/entities/**/*.js' : 'src/entities/**/*.ts'],
  migrations: [isProd ? 'dist/migrations/**/*.js' : 'src/migrations/**/*.ts'],
  subscribers: [isProd ? 'dist/subscribers/**/*.js' : 'src/subscribers/**/*.ts']
  //   dropSchema: true,
})
