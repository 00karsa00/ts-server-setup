import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"; // Ensure this is installed
import { CustomRequest } from "../../type.config/custom";

const SECRET_KEY = process.env.JWT_SECRET || "test";
const whiteListUrl: string[] = [
  "/api/auth/login",
  "/api/users",
  "/api/users",
];

export const authMiddleware = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!whiteListUrl.includes(req.url)) {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, SECRET_KEY);
      req.user = decoded;
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
