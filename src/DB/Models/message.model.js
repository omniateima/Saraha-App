import mongoose, { Schema, Types, model } from "mongoose";

const messageSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    sender: {
      type: Types.ObjectId,
      ref: "User",
    },
    receiver: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const MessagesModel =
  mongoose.models.Message || model("Message", messageSchema);
export default MessagesModel;
