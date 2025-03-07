import { NextFunction, Request, Response } from "express";
import { IUserInteractor } from "../interfaces/IUser/IUserInteractor";
import { inject, injectable } from "inversify";
import { USER_INTERFACE_TYPE } from "../utils/appConst";
import { CustomRequest } from "../type.config/custom";
import { CustomError } from "../utils/error";
import { PasswordUtil } from "../utils/encryptdata/PasswordUtil";

@injectable()
export class User {
  private interactor: IUserInteractor;
  private passwordUtil: PasswordUtil;

  constructor(
    @inject(USER_INTERFACE_TYPE.UserInteractor) interactor: IUserInteractor
  ) {
    this.interactor = interactor;
    this.passwordUtil = new PasswordUtil();
  }

  async onCreateUser(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password, name } = req.body;
      const user = await this.interactor.createUser({
        name,
        email,
        password: await this.passwordUtil.hashPassword(password),
      });
      req.success = {
        status: 201,
        message: "User Register Successfully",
      };
    } catch (error) {
      if (error instanceof CustomError) {
        req.error = { status: error.status, message: error.message };
      } else {
        req.error = { status: 500, message: "Server error!!" };
      }
    } finally {
      next();
    }
  }

  async onGetAllUsers(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const users = await this.interactor.getAllUsers({});
      req.success = {
        status: 201,
        message: "Get All Users Successfully",
        data: { users },
      };
    } catch (error) {
      req.error = { status: 500, message: "Server Error!" };
    } finally {
      next();
    }
  }

  async onGetUser(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const { userId } = req.user;
      const user = await this.interactor.getUser({ _id: userId });
      if (!user) {
        req.success = {
          status: 401,
          message: "User info was not found",
        };
        return next();
      }
      const { password, ...rest } = user || {};
      req.success = {
        status: 201,
        message: "Get All Users Successfully",
        data: { user: rest },
      };
      return next();
    } catch (error) {
      req.error = { status: 500, message: "Server Error!" };
      return next();
    }
  }

  async onUpdateUser(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { email } = req.body;
      const users = await this.interactor.updateUser(Number(id), { email });
      req.success = {
        status: 201,
        message: "Update User Info..",
      };
    } catch (error) {
      req.error = { status: 500, message: "Server Error!" };
    } finally {
      next();
    }
  }
}
