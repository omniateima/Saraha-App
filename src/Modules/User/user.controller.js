import { Router } from "express";
import * as userService from "./user.service.js";
import { asyncHandler } from "../../utils/errorHandling/asyncHandler.js";
import { authentication, allowTo } from "../../middlewares/auth.middleware.js";
import * as userValidation from "./user.validation.js";
import { validation } from "../../middlewares/validation.middleware.js";

const router = Router();

router.get(
  "/profile",
  authentication,
  allowTo(["User", "Admin"]),
  asyncHandler(userService.getProfile)
);

router.patch(
  "/update-profile",
  authentication,
  allowTo(["User", "Admin"]),
  validation(userValidation.updateProfileSchema),
  asyncHandler(userService.updateProfile)
);

router.patch(
  "/change-password",
  authentication,
  allowTo(["User", "Admin"]),
  validation(userValidation.changePasswordSchema),
  asyncHandler(userService.changePassword)
);

router.delete(
  "/deactivate-account",
  authentication,
  allowTo(["User", "Admin"]),
  asyncHandler(userService.deactivateAccount)
);

export default router;
