import { EventEmitter } from "events";
import sendEmail, { subject } from "./sendEmail.js";
import { resetPassword, signUp } from "./generateHTML.js";
import { generateToken } from "../token/token.js";

export const emailEmitter = new EventEmitter();

emailEmitter.on("sendAcctivationEmail", async (email, userName) => {
  const token = generateToken({
    payload: { email },
    signature: process.env.TOKEN_SECRET_EMAIL,
  });
  const link = `http://localhost:3000/auth/activate_account/${token}`;

  const isSent = await sendEmail({
    to: email,
    subject: subject.register,
    html: signUp(link, userName),
  });
  if (!isSent) {
    return next(new Error("Oops! there is problem while sending email", {
      cause: 500,
    }));
  }
});

emailEmitter.on("sendForgetPasswordEmail", async (email, otp) => {
  const isSent = await sendEmail({
    to: email,
    subject: subject.resetPassword,
    html: resetPassword(otp),
  });
  if (!isSent) {
    return next(new Error("Oops! there is problem while sending email", {
      cause: 500,
    }));
  }
});
