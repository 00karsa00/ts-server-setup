import knex, { Knex } from "knex";
import dotenv from "dotenv";

dotenv.config();

export class Database {
  public knexInstance: Knex;

  constructor() {
    this.knexInstance = knex({
      client: "mysql2",
      connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
      },
    });
  }

  public async connect() {
    try {
      await this.knexInstance.raw("SELECT 1");
      console.log("Database Connected");
    } catch (error) {
      console.error("Database Connection Failed:", error);
    }
  }
}
