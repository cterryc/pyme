import { AppDataSource } from "../config/data-source";
import { SeedService } from "../utils/seed.utils";

/**
 * @class TypeORMManager
 * @description Manages the TypeORM database connection with automatic seeding
 */
export default class TypeORMManager {
    private static seedService: SeedService;

    /**
     * @method connect
     * @description Establishes connection to PostgreSQL database using TypeORM with automatic seeding
     * @param options - Connection options
     * @param options.autoSeed - Whether to automatically seed the database (default: true)
     * @returns {Promise<void>}
     */
    static async connect(options?: { autoSeed?: boolean }): Promise<void> {
        try {
            if (!AppDataSource.isInitialized) {
                await AppDataSource.initialize();
                console.log("✅ Database connection established successfully");

                // Initialize seed service
                this.seedService = new SeedService(AppDataSource);

                // Auto-seed if enabled (default: true)
                const shouldSeed = options?.autoSeed !== false;
                
                if (shouldSeed) {
                    await this.autoSeedDatabase();
                } else {
                    console.log("🔶 Auto-seeding disabled, checking database status...");
                    const status = await this.seedService.getDatabaseStatus();
                    console.log("📊 Database status:", status);
                }
            }
        } catch (error) {
            console.error("❌ Error connecting to database:", error);
            throw error;
        }
    }

    /**
     * @method autoSeedDatabase
     * @description Automatically seeds the database if needed
     * @private
     */
    private static async autoSeedDatabase(): Promise<void> {
        try {
            const isSeeded = await this.seedService.isDatabaseSeeded();
            
            if (isSeeded) {
                console.log("🔶 Database already seeded, skipping...");
                const status = await this.seedService.getDatabaseStatus();
                console.log("📊 Current database status:", status);
                return;
            }

            console.log("🌱 Database not seeded, starting automatic seeding...");
            const result = await this.seedService.initializeDatabase();
            
            if (result.success) {
                console.log("✅ Automatic seeding completed successfully");
            } else {
                console.warn("⚠️ Automatic seeding completed with warnings:", result.message);
            }
        } catch (error) {
            console.error("❌ Error during automatic seeding:", error);
            // Don't throw error - connection should still work even if seeding fails
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

    /**
     * @method seedDatabase
     * @description Manually seed the database (useful for testing or migrations)
     * @returns {Promise<{success: boolean; message: string}>}
     */
    static async seedDatabase(): Promise<{success: boolean; message: string}> {
        if (!this.seedService) {
            this.seedService = new SeedService(AppDataSource);
        }
        return await this.seedService.initializeDatabase();
    }

    /**
     * @method getDatabaseStatus
     * @description Get current database seeding status
     * @returns {Promise<{industries: number; riskTierConfigs: number; systemConfigs: number}>}
     */
    static async getDatabaseStatus(): Promise<{
        industries: number;
        riskTierConfigs: number;
        systemConfigs: number;
    }> {
        if (!this.seedService) {
            this.seedService = new SeedService(AppDataSource);
        }
        return await this.seedService.getDatabaseStatus();
    }

    /**
     * @method isDatabaseSeeded
     * @description Check if database is properly seeded
     * @returns {Promise<boolean>}
     */
    static async isDatabaseSeeded(): Promise<boolean> {
        if (!this.seedService) {
            this.seedService = new SeedService(AppDataSource);
        }
        return await this.seedService.isDatabaseSeeded();
    }
}