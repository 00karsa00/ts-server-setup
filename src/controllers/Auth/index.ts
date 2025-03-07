import { NextFunction, Response } from "express";
import { inject } from "inversify";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { getClientIp } from "request-ip";
import userAgent from "express-useragent";
import { IUserInteractor } from "../../interfaces/IUser/IUserInteractor";
import { USER_INTERFACE_TYPE } from "../../utils/appConst";
import { CustomRequest } from "../../type.config/custom";
import { PasswordUtil } from "../../utils/encryptdata/PasswordUtil";
import { SessionModel } from "../../entities/session";

dotenv.config();

export class AuthController {
  constructor(
    @inject(USER_INTERFACE_TYPE.UserInteractor)
    private readonly interactor: IUserInteractor,
    private readonly passwordUtil: PasswordUtil = new PasswordUtil()
  ) {}

  private async createSession(userId: string, req: CustomRequest) {
    const deviceInfo = userAgent.parse(req.headers["user-agent"] || "");
    const ipAddress = getClientIp(req) || "Unknown";

    return SessionModel.create({
      userId,
      device: deviceInfo.browser || "Unknown",
      ip: ipAddress,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours
      isActive: true,
    });
  }

  async onLoginUser(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const userInfo = await this.interactor.getUser({ email });

      if (!userInfo) {
        return this.handleResponse(req, next, 401, "Email ID not found.");
      }

      if (
        !(await this.passwordUtil.comparePassword(password, userInfo.password))
      ) {
        return this.handleResponse(req, next, 401, "Invalid password.");
      }

      // Create session
      const session: any = await this.createSession(
        userInfo._id.toString(),
        req
      );

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: userInfo._id.toString(),
          email,
          name: userInfo.name,
          sessionId: session._id.toString(),
        },
        process.env.JWT_SECRET as string,
        { expiresIn: "12h" }
      );

      return this.handleResponse(req, next, 201, "Login successful!", {
        token,
      });
    } catch (error) {
      console.error("Login Error:", error);
      return this.handleError(req, next);
    }
  }

  async onLogoutUser(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith("Bearer ")) {
        return this.handleResponse(req, next, 401, "Unauthorized.");
      }

      const token = authHeader.split(" ")[1];
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

      // Deactivate the session
      await SessionModel.findOneAndUpdate(
        { _id: decoded.sessionId, userId: decoded.userId, isActive: true },
        { isActive: false }
      );

      return this.handleResponse(req, next, 200, "Logout successful.");
    } catch (error) {
      console.error("Logout Error:", error);
      return this.handleError(req, next);
    }
  }

  async onLogoutAllDevice(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith("Bearer ")) {
        return this.handleResponse(req, next, 401, "Unauthorized.");
      }

      const token = authHeader.split(" ")[1];
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

      // Deactivate the session
      await SessionModel.findOneAndUpdate(
        { userId: decoded.userId, isActive: true },
        { isActive: false }
      );
      return this.handleResponse(req, next, 200, "Logout successful.");
    } catch (error) {
      console.error("Logout Error:", error);
      return this.handleError(req, next);
    }
  }

  async onLogoutAllOtherDevice(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith("Bearer ")) {
        return this.handleResponse(req, next, 401, "Unauthorized.");
      }

      const token = authHeader.split(" ")[1];
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

      // Deactivate the session
      await SessionModel.findOneAndUpdate(
        {
          userId: decoded.userId,
          isActive: true,
          _id: { $ne: decoded.sessionId },
        },
        { isActive: false }
      );

      return this.handleResponse(req, next, 200, "Logout successful.");
    } catch (error) {
      console.error("Logout Error:", error);
      return this.handleError(req, next);
    }
  }

  private handleResponse(
    req: CustomRequest,
    next: NextFunction,
    status: number,
    message: string,
    data: any = null
  ) {
    req.success = { status, message, ...(data && { data }) };
    return next();
  }

  private handleError(req: CustomRequest, next: NextFunction) {
    req.error = { status: 500, message: "Server Error!" };
    return next();
  }
}
