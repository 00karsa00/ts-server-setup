import express, { Router } from "express";
import { ProductRoutes } from "./ProductRoutes";
import { UserRoutes } from "./UserRoutes";
import { AuthRoutes } from "./auth";

export class Routes {
  public router: Router;

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.use("/products", new ProductRoutes().router);
    this.router.use("/users", new UserRoutes().router);
    this.router.use("/auth", new AuthRoutes().router);
  }
}
