// src/routes/index.ts
import express, { Router } from 'express';
import { ProductRoutes } from './ProductRoutes';

export class Routes {
  public router: Router;

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', (req, res) => {        
        res.send('Welcome to the API');
    });
    this.router.use('/products', new ProductRoutes().router);
  }
}
