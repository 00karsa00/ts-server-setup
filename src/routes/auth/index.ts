import express,{ Router } from "express";
import { Container } from "inversify";
import { AuthController } from "../../controllers/Auth";
import { AUTH_INTERFACE_TYPE, USER_INTERFACE_TYPE } from "../../utils/appConst";
import { IUserRepository } from "../../interfaces/IUser/IUserRepository";
import { UserRepository } from "../../repositories/UserRepository";
import { IUserInteractor } from "../../interfaces/IUser/IUserInteractor";
import { UserInteractor } from "../../interactors/UserInteractor";

export class AuthRoutes {
  public router: Router;
  private container: Container;
  private controller: AuthController;

  constructor() {
    this.router = express.Router();
    this.container = new Container();
    this.initializeRoutes();
    this.initializeBindings();
    this.controller = this.container.get<AuthController>(AUTH_INTERFACE_TYPE.AuthController);
  }
  
  private initializeBindings() {
    this.container.bind<IUserRepository>(USER_INTERFACE_TYPE.UserRepository).to(UserRepository);
    this.container.bind<IUserInteractor>(USER_INTERFACE_TYPE.UserInteractor).to(UserInteractor);    
    this.container.bind(AUTH_INTERFACE_TYPE.AuthController).to(AuthController);
  }

  private initializeRoutes() {
    this.router.post("/login",(req, res, next) =>  this.controller.onLoginUser(req, res, next));
    this.router.get("/logout",(req, res, next) =>  this.controller.onLogoutUser(req, res, next));
    this.router.get("/logoutAllDevice",(req, res, next) =>  this.controller.onLogoutAllDevice(req, res, next));
    this.router.get("/logoutAllOtherDevice",(req, res, next) =>  this.controller.onLogoutAllOtherDevice(req, res, next));
  }
}
