import express, { Router } from "express";
import { Container } from "inversify";
import { USER_INTERFACE_TYPE } from "../utils/appConst";
import { User } from "../controllers/UserControllers";
import { IUserRepository } from "../interfaces/IUser/IUserRepository";
import { UserRepository } from "../repositories/UserRepository";
import { IUserInteractor } from "../interfaces/IUser/IUserInteractor";
import { UserInteractor } from "../interactors/UserInteractor";
import { validate } from "../interfaces/middleware/requestValidation";
import {
  userSchema,
  userUpdateSchema,
} from "../interfaces/middleware/requestValidation/user";

export class UserRoutes {
  public router: Router;
  private container: Container;
  private controller: User;

  constructor() {
    this.router = express.Router();
    this.container = new Container();
    this.initializeBindings(); // This should be called first
    this.controller = this.container.get<User>(
      USER_INTERFACE_TYPE.UserController
    );
    this.initializeRoutes();
  }

  private initializeBindings() {
    this.container
      .bind<IUserRepository>(USER_INTERFACE_TYPE.UserRepository)
      .to(UserRepository);
    this.container
      .bind<IUserInteractor>(USER_INTERFACE_TYPE.UserInteractor)
      .to(UserInteractor);
    this.container.bind(USER_INTERFACE_TYPE.UserController).to(User);
  }

  private initializeRoutes() {
    this.router.post(
      "/",
      validate(userSchema) as express.RequestHandler,
      (req, res, next) => this.controller.onCreateUser(req, res, next)
    );
    this.router.get("/", (req, res, next) =>
      this.controller.onGetUser(req, res, next)
    );
    this.router.put(
      "/:id",
      validate(userUpdateSchema) as express.RequestHandler,
      (req, res, next) => this.controller.onUpdateUser(req, res, next)
    );
  }
}
