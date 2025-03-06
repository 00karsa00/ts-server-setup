import { Queue } from "bullmq";
import dotenv from "dotenv";

dotenv.config();

export const mailQueue = new Queue("mailQueue", {
  connection: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379,
  },
});
