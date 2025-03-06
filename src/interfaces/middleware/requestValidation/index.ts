import Joi, { ObjectSchema } from "joi";
import { Request, Response, NextFunction } from "express";

export const validate =
  (schema: {
    body?: ObjectSchema;
    query?: ObjectSchema;
    params?: ObjectSchema;
  }) =>
  (req: Request, res: Response, next: NextFunction) => {
    const validationErrors: Record<string, any[]> = {};

    if (schema.body) {
      const { error } = schema.body.validate(req.body, { abortEarly: false });
      if (error)
        validationErrors.body = error.details.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));
    }

    if (schema.query) {
      const { error } = schema.query.validate(req.query, { abortEarly: false });
      if (error)
        validationErrors.query = error.details.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));
    }

    if (schema.params) {
      const { error } = schema.params.validate(req.params, {
        abortEarly: false,
      });
      if (error)
        validationErrors.params = error.details.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));
    }

    if (Object.keys(validationErrors).length > 0) {
      return res.status(400).json({
        message: "Validation error",
        errors: validationErrors,
      });
    }

    next();
  };
