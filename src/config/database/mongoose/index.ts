import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export class MongoDB {
  private static instance: MongoDB;
  private mongoURI: string;

  private constructor() {
    // this.mongoURI = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`;
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
}

// const mongoDB = MongoDB.getInstance();
// mongoDB.connect();
