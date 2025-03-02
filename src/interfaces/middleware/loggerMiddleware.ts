import { Request, Response, NextFunction } from "express";
import { logger } from "../../utils/logger";

export const logRequestResponse = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { method, url } = req;
  logger.info(
    `${req.method} ${req.url} Body => ${JSON.stringify(
      req.body
    )} Params => ${JSON.stringify(req.params)} Query => ${JSON.stringify(
      req.query
    )}`
  );
  const startTime = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const { statusCode } = res;
    logger.info(`${method} ${url} ${statusCode} - ${duration}ms`);
  });

  next();
};
