import "reflect-metadata";
import express, { Application, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Routes } from "./routes";
import { responseHandler } from "./interfaces/middleware/responseHandler";
import { logRequestResponse } from "./interfaces/middleware/loggerMiddleware";
import { logger } from "./utils/logger";
// import { Database } from "./config/Database";
import { AppDataSource } from "./config/database/typeOrm";
import { authMiddleware } from "./interfaces/middleware/authMiddleware";
import { MongoDB } from "./config/database/mongoose";

dotenv.config();
class Server {
  private app: Application;
  private port: number;
  // private database;

  constructor() {
    this.app = express();
    this.port = Number(process.env.PORT) || 5000;
    // this.database = new Database();
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeResponseHandling();
    // this.typeOrmConnect();
    this.mongooseOrmConnect();
    this.start();
  }

  private initializeMiddleware(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(logRequestResponse);
    this.app.use(authMiddleware as express.RequestHandler);
  }

  private initializeRoutes(): void {
    this.app.use("/api", new Routes().router);
  }

  private initializeResponseHandling(): void {
    this.app.use(responseHandler as express.RequestHandler);
  }

  private async typeOrmConnect(): Promise<void> {
    try {
      await AppDataSource.initialize();
      console.log("Data Source has been initialized!");
    } catch (error) {
      console.error("Error during Data Source initialization:", error);
    }
  }

  private async mongooseOrmConnect(): Promise<void> {
    try {
      const mongoDB = MongoDB.getInstance();
      await mongoDB.connect();
    } catch (error) {
      console.error("Error during mongose connection:", error);
    }
  }

  private async start(): Promise<void> {
    try {
      // await this.database.connect();
      this.app.listen(this.port, () => {
        logger.info(`Server running on port ${this.port}`);
      });
    } catch (error) {
      logger.error("Failed to start the server:", `${error}`);
    }
  }
}

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error.message);
});

process.on("unhandledRejection", (reason: any) => {
  logger.error("Unhandled Rejection:", reason);
});

new Server();
