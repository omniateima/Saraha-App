import joi from "joi";
import { generalFields } from "../../middlewares/validation.middleware.js";

export const registerSchema = joi.object({
  userName: generalFields.userName.required(),
  email: generalFields.email.required(),
  password: generalFields.password.required(),
  confirmPassword: generalFields.confirmPassword.required(),
  gender: generalFields.gender,
  role: generalFields.role,
  phone: generalFields.phone,
}).required();

export const loginSchema = joi.object({
  email: generalFields.email.required(),
  password: generalFields.password.required(),
}).required();

////
export const forgetPasswordSchema = joi.object({
  email: generalFields.email.required(),
}).required();


////
export const resetPasswordSchema = joi.object({
  token: generalFields.token.required(),
  password: generalFields.password.required(),
  confirmNewPassword: generalFields.confirmPassword.required(),
}).required();


