import { Types } from "mongoose";
import joi from "joi";
import { roles } from "./auth.middleware.js";

export const validation = (schema) => {
  return (req, res, next) => {
    const data = { ...req.body, ...req.params, ...req.query };
    const results = schema.validate(data, { abortEarly: false });
    if (results.error) {
      const errorMessages = results.error.details.map((obj) => obj.message);
      return next(new Error(errorMessages, { cause: 400 }));
    }
    return next();
  };
};

export const isValidObjectId = (value, helper) => {
  if (Types.ObjectId.isValid(value)) return value;
  return helper.message("Value must be a valid ObjectId");
};

export const generalFields = {
  userName: joi.string().min(3).max(20),
  email: joi.string().email(),
  password: joi.string(),
  confirmPassword: joi.string().valid(joi.ref("password")),
  gender: joi.string().valid("male", "female"),
  role: joi.string().valid(...Object.values(roles)),
  phone: joi.string(),
  id: joi.custom(isValidObjectId),
  token: joi.string().required(),
  content: joi.string(),
};
