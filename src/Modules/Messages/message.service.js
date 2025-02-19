import UserModel from "../../DB/Models/user.model.js";
import MessagesModel from "../../DB/Models/message.model.js";
import { flags } from "./message.validation.js";

const populate = [
  { path: "sender", select: "userName email -_id" },
  { path: "receiver", select: "userName email -_id" },
];

export const getMessages = async (req, res, next) => {
  const { flag } = req.query;
  return res.status(200).json({
    success: true,
    results:
      flag == flags.inbox
        ? await MessagesModel.find({ receiver: req.user._id }).populate(
            populate
          )
        : await MessagesModel.find({ sender: req.user._id }).populate(populate),
  });
};
export const getSingleMessage = async (req, res, next) => {
  const { messageId } = req.params;
  const message = await MessagesModel.findById(messageId).populate(populate);
  if (!message) return next(new Error("Message not found!", { cause: 404 }));
  if (
    message.receiver.email === req.user.email ||
    message.sender.email === req.user.email
  ) {
    return res.status(200).json({ success: true, results: message });
  }
  return next(new Error("Forbidden", { cause: 403 }));
};

export const sendMessage = async (req, res, next) => {
  const { content, receiver } = req.body;
  const user = await UserModel.findById(receiver);
  if (!user) return next(new Error("User dosn't exist!", { cause: 404 }));

  const message = await MessagesModel.create({
    content,
    receiver,
    sender: req.user._id,
  });
  return res.status(200).json({
    success: true,
    message: "Message sent successfully",
    results: message,
  });
};

export const editMessage = async (req, res, next) => {
  const { messageId } = req.params;
  const userId = req.user._id;
  const { content } = req.body;
  const message = await MessagesModel.findOneAndUpdate(
    {
      _id: messageId,
      sender: userId,
    },
    { content: content },
    {
      runValidators: true,
      new: true,
    }
  ).populate(populate);

  if (!message)
    return next(new Error("Message not found or Forbidden!", { cause: 404 }));

  return res.status(200).json({ success: true, results: message });
};

export const deleteMessage = async (req, res, next) => {
  const { messageId } = req.params;
  const userId = req.user._id;
  const message = await MessagesModel.findOneAndDelete({
    _id: messageId,
    sender: userId,
  });
  if (!message)
    return next(new Error("Message not found or Forbidden!", { cause: 404 }));

  return res.status(204).json({ success: true, message: "Done" });
};
