import express, { Router } from "express";
import { UserRoutes } from "./UserRoutes";
import { AuthRoutes } from "./auth";
import { MedicineRoutes } from "./MedicineRoutes";

export class Routes {
  public router: Router;

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.use("/users", new UserRoutes().router);
    this.router.use("/auth", new AuthRoutes().router);
    this.router.use("/medicines", new MedicineRoutes().router);
  }
}
