import "reflect-metadata";
import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Routes } from "./routes";
import { responseHandler } from "./interfaces/middleware/responseHandler";
import { logRequestResponse } from "./interfaces/middleware/loggerMiddleware";
import { logger } from "./utils/logger";
import { authMiddleware } from "./interfaces/middleware/authMiddleware";
import { MongoDB } from "./config/database/mongoose";

dotenv.config();
class Server {
  private static instance: Server;
  private app: Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = Number(process.env.PORT) || 5000;
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeResponseHandling();
    this.mongooseOrmConnect();
    this.start();
  }

  public static getInstance(): Server {
    if (!Server.instance) {
      Server.instance = new Server();
    }
    return Server.instance;
  }

  private initializeMiddleware(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(logRequestResponse);
    this.app.use(authMiddleware as express.RequestHandler);
  }

  private initializeRoutes(): void {
    this.app.use("/api", new Routes().router);

    this.app.get("/health", async (_req, res) => {
      try {
        await MongoDB.getInstance().ping(); 
        res.status(200).json({ status: "healthy" });
      } catch (error: any) {
        res.status(500).json({ status: "unhealthy", error: error.message });
      }
    });
  }

  private initializeResponseHandling(): void {
    this.app.use(responseHandler as express.RequestHandler);
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
      this.app.listen(this.port, () => {
        logger.info(`Server running on port ${this.port}`);
      });

      process.on("SIGINT", async () => {
        logger.info("Graceful shutdown initiated...");
          await MongoDB.getInstance()
          .disconnect()
          .catch((err:any) => logger.error("MongoDB Shutdown Error:", err));
        process.exit(0);
      });
    } catch (error) {
      logger.error("Failed to start the server:", `${error}`);
    }
  }
}

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", JSON.stringify({ message: error.message, stack: error.stack }));
  process.exit(1);
});

process.on("unhandledRejection", (reason: any) => {
  logger.error("Unhandled Rejection:", reason);
});

Server.getInstance();
