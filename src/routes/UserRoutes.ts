import express,{ Router } from "express";
import { Container } from "inversify";
import { USER_INTERFACE_TYPE } from "../utils/appConst";
import { User } from "../controllers/User";
import { IUserRepository } from "../interfaces/IUser/IUserRepository";
import { UserRepository } from "../repositories/UserRepository";
import { IUserInteractor } from "../interfaces/IUser/IUserInteractor";
import { UserInteractor } from "../interactors/UserInteractor";


export class UserRoutes {
  public router: Router;
  private container: Container;
  private controller: User;

  constructor() {
    this.router = express.Router();
    this.container = new Container();
    this.initializeRoutes();
    this.initializeBindings();
    this.controller = this.container.get<User>(USER_INTERFACE_TYPE.UserController);
  }
  
  private initializeBindings() {
    this.container.bind<IUserRepository>(USER_INTERFACE_TYPE.UserRepository).to(UserRepository);
    this.container.bind<IUserInteractor>(USER_INTERFACE_TYPE.UserInteractor).to(UserInteractor);    
    this.container.bind(USER_INTERFACE_TYPE.UserController).to(User);
  }

  private initializeRoutes() {
    this.router.post("/", (req, res, next) => this.controller.onCreateUser(req, res, next));
    this.router.get("/", (req, res, next) => this.controller.onGetAllUsers(req, res, next));
    this.router.get("/:id", (req, res, next) => this.controller.onGetUser(req, res, next));
    this.router.put("/:id", (req, res, next) => this.controller.onGetUser(req, res, next));
  }
}
