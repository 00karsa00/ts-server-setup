import knex, { Knex } from "knex";
import dotenv from "dotenv";
import { logger } from "../utils/logger";
dotenv.config();
export class Database {
  public knexInstance: Knex;

  constructor() {
    this.knexInstance = knex({
      client: "mysql2",
      connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      },
    });
   
  }

  public async connect() {
    try {
      await this.knexInstance.raw("SELECT 1");
      logger.info("Database Connected");
    } catch (error) {
      logger.error("Failed to connect to the database:", `${error}`);
    }
  }
}
