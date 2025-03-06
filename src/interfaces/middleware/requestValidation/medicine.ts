import Joi from "joi";

export const medicineSchema = {
  body: Joi.object({
    name: Joi.string().required().messages({
      "any.required": "Name is required",
      "string.empty": "Name cannot be empty",
    }),

    description: Joi.string().required().messages({
      "any.required": "Description is required",
      "string.empty": "Description cannot be empty",
    }),

    asDone: Joi.boolean().optional(),

    type: Joi.string().valid("oneTimeOnly", "recurring").required().messages({
      "any.required": "Type is required",
      "any.only": 'Type must be either "oneTimeOnly" or "recurring"',
    }),

    recurringType: Joi.string()
      .valid("daily", "weekly")
      .when("type", {
        is: "recurring",
        then: Joi.required().messages({
          "any.required": "Recurring type is required when type is 'recurring'",
          "any.only": 'Recurring type must be either "daily" or "weekly"',
        }),
        otherwise: Joi.forbidden(),
      }),

    date: Joi.string()
      .pattern(/^\d{4}-\d{2}-\d{2}$/)
      .optional()
      .messages({ "string.pattern.base": "Date must be in YYYY-MM-DD format" }),

    time: Joi.string()
      .pattern(/^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/)
      .optional()
      .messages({
        "string.pattern.base": "Time must be in HH:MM AM/PM format",
      }),

    endDate: Joi.string()
      .pattern(/^\d{4}-\d{2}-\d{2}$/)
      .when("type", {
        is: "recurring",
        then: Joi.required().messages({
          "any.required": "End date is required when type is 'recurring'",
          "string.pattern.base": "Date must be in YYYY-MM-DD format",
        }),
        otherwise: Joi.forbidden(),
      }),

    day: Joi.string()
      .valid(
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday"
      )
      .when("recurringType", {
        is: "weekly",
        then: Joi.required().messages({
          "any.required":
            "At least one day is required when recurringType is 'weekly'",
          "any.only": "Day must be a valid day of the week",
        }),
        otherwise: Joi.forbidden(),
      }),
  }),
};

export const medicineUpdateSchema = {
  body: Joi.object({
    name: Joi.string().required().messages({
      "any.required": "Name is required",
      "string.empty": "Name cannot be empty",
    }),

    description: Joi.string().required().messages({
      "any.required": "Description is required",
      "string.empty": "Description cannot be empty",
    }),

    asDone: Joi.boolean().optional(),

    type: Joi.string().valid("oneTimeOnly", "recurring").required().messages({
      "any.required": "Type is required",
      "any.only": 'Type must be either "oneTimeOnly" or "recurring"',
    }),

    recurringType: Joi.string()
      .valid("daily", "weekly")
      .when("type", {
        is: "recurring",
        then: Joi.required().messages({
          "any.required": "Recurring type is required when type is 'recurring'",
          "any.only": 'Recurring type must be either "daily" or "weekly"',
        }),
        otherwise: Joi.forbidden(),
      }),

    date: Joi.string()
      .pattern(/^\d{4}-\d{2}-\d{2}$/)
      .optional()
      .messages({ "string.pattern.base": "Date must be in DD-MM-YYYY format" }),

    time: Joi.string()
      .pattern(/^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/)
      .optional()
      .messages({
        "string.pattern.base": "Time must be in HH:MM AM/PM format",
      }),

    endDate: Joi.string()
      .pattern(/^\d{4}-\d{2}-\d{2}$/)
      .when("type", {
        is: "recurring",
        then: Joi.required().messages({
          "any.required": "End date is required when type is 'recurring'",
          "string.pattern.base": "Date must be in DD-MM-YYYY format",
        }),
        otherwise: Joi.forbidden(),
      }),

    day: Joi.string()
      .valid(
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday"
      )
      .when("recurringType", {
        is: "weekly",
        then: Joi.required().messages({
          "any.required":
            "At least one day is required when recurringType is 'weekly'",
          "any.only": "Day must be a valid day of the week",
        }),
        otherwise: Joi.forbidden(),
      }),
  }),
  params: Joi.object({
    id: Joi.string().required().messages({
      "any.required": "Id is required",
      "string.empty": "Id cannot be empty",
    }),
  }),
};
