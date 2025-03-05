import { Response, NextFunction } from "express";
import { CustomRequest } from "../../type.config/custom";

export const responseHandler = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.success) {
    return res.status(req.success.status).json(req.success);
  }
  if (req.error) {
    return res.status(req.error.status).json({ error: req.error.message });
  }
  next();
};
