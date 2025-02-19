import { Router } from "express";
import * as messageService from "./message.service.js";
import { asyncHandler } from "../../utils/errorHandling/asyncHandler.js";
import { allowTo, authentication } from "../../middlewares/auth.middleware.js";
import { validation } from "../../middlewares/validation.middleware.js";
import * as messageValidation from "./message.validation.js";

const router = Router();
router.get(
  "/",
  authentication,
  allowTo(["User"]),
  validation(messageValidation.getMessagesSchema),
  asyncHandler(messageService.getMessages)
);
router.get(
  "/:messageId",
  authentication,
  allowTo(["User"]),
  validation(messageValidation.getSingleMessageSchema),
  asyncHandler(messageService.getSingleMessage)
);
router.post(
  "/send-message",
  authentication,
  allowTo(["User"]),
  validation(messageValidation.sendMessageSchema),
  asyncHandler(messageService.sendMessage)
);
router.patch(
  "/edit-message/:messageId",
  authentication,
  allowTo(["User"]),
  validation(messageValidation.editMessageSchema),
  asyncHandler(messageService.editMessage)
);
router.delete(
  "/delete-message/:messageId",
  authentication,
  allowTo(["User"]),
  validation(messageValidation.deleteMessageSchema),
  asyncHandler(messageService.deleteMessage)
);

export default router;
