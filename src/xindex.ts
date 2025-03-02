import "reflect-metadata";
import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
// import { Database } from "./config/Database";
// import { Logger } from "./utils/logger";
// import { ProductRoutes } from "./routes/roductRoutes";

dotenv.config();

class Server {
  private app: Application;
  private port: number;
  // private logger: Logger
  // private database: Database;

  constructor() {
    this.app = express();
    this.port = Number(process.env.PORT) || 5000;
    // this.database = new Database();
    this.initializeMiddleware();
    this.initializeRoutes();
    this.start();
    // this.logger = new Logger();
  }

  private initializeMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private initializeRoutes() {
    // this.app.use("/users", new UserRoutes().router);
    // this.app.use("/api", new ProductRoutes().router);
  }

  private async start() {
    // await this.database.connect();
    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}

new Server();