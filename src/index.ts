// src/server.ts
import 'reflect-metadata';
import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Routes } from './routes';

dotenv.config();

class Server {
  private app: Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = Number(process.env.PORT) || 5000;
    this.initializeMiddleware();
    this.initializeRoutes();
    this.start();
  }

  private initializeMiddleware(): void {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private initializeRoutes(): void {
    this.app.get('/', (req, res) => {        
      res.send('Welcome to the API');
  });
    this.app.use('/api', new Routes().router);
  }

  private async start(): Promise<void> {
    try {
      // const database = new Database();
      // await database.connect();

      this.app.listen(this.port, () => {
        console.log(`Server running on port ${this.port}`);
      });
    } catch (error) {
      console.error('Failed to start the server:', error);
    }
  }
}

new Server();
