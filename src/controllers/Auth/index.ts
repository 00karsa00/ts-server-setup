import { NextFunction, Request, Response } from "express";
import { inject } from "inversify";
import { IUserInteractor } from "../../interfaces/IUser/IUserInteractor";
import { USER_INTERFACE_TYPE } from "../../utils/appConst";
import { CustomRequest } from "../../type.config/custom";
import jwt from "jsonwebtoken";
import { PasswordUtil } from "./../../utils/encryptdata/PasswordUtil";
import dotenv from "dotenv";
dotenv.config();

export class AuthController {
  private interactor: IUserInteractor;
  private passwordUtil: PasswordUtil;
  constructor(
    @inject(USER_INTERFACE_TYPE.UserInteractor) interactor: IUserInteractor
  ) {
    this.interactor = interactor;
    this.passwordUtil = new PasswordUtil();
  }

  async onLoginUser(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const userInfo: any = await this.interactor.getUser({ email });
      if (!userInfo) {
        req.success = {
          status: 401,
          message: "Email id was not found..",
        };
        return next();
      }
      if (
        await this.passwordUtil.comparePassword(password, userInfo.password)
      ) {
        const { _id } = userInfo;
        const token = jwt.sign(
          { userId: _id, email },
          process.env.JWT_SECRET!,
          {
            expiresIn: "1h",
          }
        );
        req.success = {
          status: 201,
          message: "Login Successfully!!",
          data: {
            token,
          },
        };
        return next();
      }
      req.success = {
        status: 401,
        message: "Password was not found",
      };
      return next();
    } catch (error) {
      req.error = { status: 500, message: "Server Error!" };
      return next();
    }
  }

  async onLogutUser(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const userInfo = await this.interactor.getUser({ email });
      if (!userInfo) {
        req.success = {
          status: 401,
          message: "Email id was not found..",
        };
        return next();
      }
      // if (!userInfo?.comparePassword(password)) {
      //   req.success = {
      //     status: 401,
      //     message: "Password was not found",
      //   };
      //   return next();
      // }
      // const { id } = userInfo;
      // const token = jwt.sign({ userId: id, email }, "process.env.JWT_SECRET!", {
      //   expiresIn: "1h",
      // });
      req.success = {
        status: 201,
        message: "Login Successfully!!",
        data: {
          // token,
        },
      };
      return next();
    } catch (error) {
      req.error = { status: 500, message: "Server Error!" };
      return next();
    }
  }
}
