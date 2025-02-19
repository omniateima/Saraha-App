import joi from "joi";
import { generalFields } from "../../middlewares/validation.middleware.js";

export const updateProfileSchema = joi
  .object({
    userName: generalFields.userName,
    email: generalFields.email,
    phone: generalFields.phone,
  })
  .required();

export const changePasswordSchema = joi
  .object({
    oldPassword: generalFields.password.required(),
    password: generalFields.password.not(joi.ref("oldPassword")).required(),
    confirmPassword: generalFields.confirmPassword.required(),
  })
  .required();
