import express, { Router } from "express";
import { ProductRoutes } from "./ProductRoutes";

export class Routes {
  public router: Router;

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.use("/products", new ProductRoutes().router);
  }
}
