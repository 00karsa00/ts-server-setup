import express, { Router } from "express";
import { UserController } from "../interfaces/UserController";

export class UserRoutes {
  public router: Router;
  private userController: UserController;

  constructor() {
    this.router = express.Router();
    this.userController = new UserController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/", (req, res) => this.userController.createUser(req, res));
    this.router.get("/", (req, res) => this.userController.getUsers(req, res));
  }
}
