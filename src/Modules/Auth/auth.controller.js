import { Router } from "express";
import * as authService from "./auth.service.js";
import { asyncHandler } from "../../utils/errorHandling/asyncHandler.js";
import { validation } from "../../middlewares/validation.middleware.js";
import * as authValidation from "./auth.validation.js";

const router = Router();
router.post(
  "/register",
  validation(authValidation.registerSchema),
  asyncHandler(authService.register)
);
router.post(
  "/login",
  validation(authValidation.loginSchema),
  asyncHandler(authService.login)
);
router.get(
  "/activate_account/:token",
  asyncHandler(authService.activateAccount)
);
router.patch(
  "/forget_password",
  validation(authValidation.forgetPasswordSchema),
  asyncHandler(authService.forgetPassword)
);
router.post("/check_otp/:token", asyncHandler(authService.checkOtp));
router.patch(
  "/reset_password/:token",
  validation(authValidation.resetPasswordSchema),
  asyncHandler(authService.resetPassword)
);

export default router;
