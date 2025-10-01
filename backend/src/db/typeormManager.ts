import { AppDataSource } from "../config/data-source";

/**
 * @class TypeORMManager
 * @description Manages the TypeORM database connection
 */
export default class TypeORMManager {
    /**
     * @method connect
     * @description Establishes connection to PostgreSQL database using TypeORM
     * @returns {Promise<void>}
     */
    static async connect(): Promise<void> {
        try {
            if (!AppDataSource.isInitialized) {
                await AppDataSource.initialize();
                console.log("✅ Database connection established successfully");
            }
        } catch (error) {
            console.error("❌ Error connecting to database:", error);
            throw error;
        }
    }

    /**
     * @method disconnect
     * @description Closes the database connection
     * @returns {Promise<void>}
     */
    static async disconnect(): Promise<void> {
        try {
            if (AppDataSource.isInitialized) {
                await AppDataSource.destroy();
                console.log("✅ Database connection closed successfully");
            }
        } catch (error) {
            console.error("❌ Error disconnecting from database:", error);
            throw error;
        }
    }

    /**
     * @method getDataSource
     * @description Returns the TypeORM DataSource instance
     * @returns {DataSource}
     */
    static getDataSource() {
        return AppDataSource;
    }
}
