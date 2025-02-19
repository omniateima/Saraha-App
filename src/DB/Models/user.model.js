import mongoose, { Schema, model } from "mongoose";
import { roles } from "../../middlewares/auth.middleware.js";

const userSchema = new Schema( //userSchema is instence from Schema class
  {
    userName: {
      type: String,
      required: [true, "userName is required"],
      minLength: [3, "username must at least 3 chars"],
      maxLength: [20, "username must be at most 20 chars"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "email must be unique"],
      lowercase: true,
      trim: true,
      match: /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female"],
        message: "value is not supported",
      },
    },
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: {
        values: Object.values(roles),
        message: "value is not supported",
        default: roles.User,
      },
    },
    DOB: Date,
    phone: String,
    image: String,
    address: String,
    changedAt: Date,
    otp: {
      otp: String,
      otpExpier: Date,
      maxOtpAttemps: {
        type: Number,
        default: Number(process.env.MAX_OTP_ATTEMPTS),
      },
      otpAttempsExpier:{
        type: Date,
        default: null,
      }
    },
    isDeactivate: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.models.User || model("User", userSchema); //create model if it is not exist
export default UserModel;
