import joi from "joi";
import { generalFields } from "../../middlewares/validation.middleware.js";


export const flags = {
  inbox: "inbox",
  outbox: "outbox",
};

export const getMessagesSchema = joi
  .object({
    flag: joi
      .string()
      .valid(...Object.values(flags))
      .required(),
  })
  .required();

export const getSingleMessageSchema = joi
  .object({
    messageId: generalFields.id.required(),
  })
  .required();

export const sendMessageSchema = joi.object({
    content: generalFields.content.required(),
    receiver: generalFields.id.required(),
  })
  .required();

export const editMessageSchema = joi
  .object({
    messageId:generalFields.id.required(),
    content: generalFields.content.required(),
  })
  .required();

export const deleteMessageSchema = joi
  .object({
    messageId: generalFields.id.required(),
  })
  .required();
