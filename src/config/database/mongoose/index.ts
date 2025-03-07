import mongoose from "mongoose";
import dotenv from "dotenv";
import { logger } from "../../../utils/logger";

dotenv.config();

export class MongoDB {
  private static instance: MongoDB;
  private mongoURI: string;

  private constructor() {
    this.mongoURI = `mongodb://localhost:27017/${process.env.DB_NAME}`;
  }

  public static getInstance(): MongoDB {
    if (!MongoDB.instance) {
      MongoDB.instance = new MongoDB();
    }
    return MongoDB.instance;
  }

  public async connect(): Promise<void> {
    try {
      await mongoose.connect(this.mongoURI);
      console.log("MongoDB connected");
    } catch (err) {
      console.error(err);
    }
  }

  
  public async ping(): Promise<void> {
    if (mongoose.connection.readyState !== 1) {
      throw new Error("MongoDB is not connected");
    }
    logger.debug("MongoDB is connected and reachable.");
  }

  public async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      logger.info("MongoDB disconnected gracefully.");
    } catch (err: any) {
      logger.error(`Error while disconnecting MongoDB: ${err.message}`);
      logger.error(err.stack);
    }
  }
}


