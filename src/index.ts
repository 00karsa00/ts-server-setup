import "reflect-metadata";
import express, { Application, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Routes } from "./routes";
import { responseHandler } from "./interfaces/middleware/responseHandler";
import { logRequestResponse } from "./interfaces/middleware/loggerMiddleware";
import { logger } from "./utils/logger";

dotenv.config();

class Server {
  private app: Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = Number(process.env.PORT) || 5000;
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeResponseHandling();
    this.start();
  }

  private initializeMiddleware(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(logRequestResponse);
  }

  private initializeRoutes(): void {
    this.app.use("/api", new Routes().router);
  }

  private initializeResponseHandling(): void {
    this.app.use(responseHandler as express.RequestHandler);
  }

  private async start(): Promise<void> {
    try {
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
