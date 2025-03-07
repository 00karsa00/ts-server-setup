import Joi from "joi";

export const userSchema = {
  body: Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
};

export const userUpdateSchema = {
  body: Joi.object({
    name: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(6).required(),
  }),
};

export const updatePasswordSchema = {
  body: Joi.object({
    oldPassword: Joi.string().min(6).required(),
    newPassword: Joi.string().min(6).required(),
    againNewPassword: Joi.string().min(6).required(),
  }),
};
