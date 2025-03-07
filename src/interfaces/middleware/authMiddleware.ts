import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { CustomRequest } from "../../type.config/custom";
import { SessionModel } from "../../entities/session";
import { getClientIp } from "request-ip";
import userAgent from "express-useragent";


const SECRET_KEY = process.env.JWT_SECRET || "test";
const WHITE_LIST_URLS = new Set(["/api/auth/login", "/api/users"]);

// Helper function to validate JWT
const validateToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, SECRET_KEY) as JwtPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Token expired");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("Invalid token");
    }
    throw new Error("Authentication failed");
  }
};

// Middleware function
export const authMiddleware = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  if (WHITE_LIST_URLS.has(req.path)) return next();

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const token = authHeader.split(" ")[1];
    req.user = validateToken(token);
    console.log(" req.user => ", req.user);
    const deviceInfo: any = userAgent.parse(req.headers["user-agent"] || "");
    const ipAddress: string = getClientIp(req) || "Unknown";
    const session = await SessionModel.findOne({ _id: req.user.sessionId , isActive: true});  
    console.log("session => ", session)
    console.log("session.device => ", deviceInfo.browser)
    console.log("ipAddress => ", ipAddress)
    if (session && session.device === deviceInfo.browser && session.ip === ipAddress ) {
      return next();
    }
    return res.status(401).json({ message: "Unauthorized" });
  } catch (error: any) {
    return res.status(401).json({ message: error.message });
  }
};
