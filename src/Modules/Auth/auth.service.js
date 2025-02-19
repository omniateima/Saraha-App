import UserModel from "../../DB/Models/user.model.js";
import { roles } from "../../middlewares/auth.middleware.js";
import { emailEmitter } from "../../utils/emails/emailEvent.js";
import { generateToken, verify } from "../../utils/token/token.js";
import { compare, hash } from "../../utils/hashing/hash.js";
import { encrypt } from "../../utils/encryption/encryption.js";
import otpGenerator from "otp-generator";

export const register = async (req, res, next) => {
  const { userName, phone, email, password, role } = req.body;
  const isExist = await UserModel.findOne({ email });
  if (isExist) {
    return next(new Error("Email already exist", { cause: 400 }));
  }
  const hasedPassword = hash({ plainText: password });
  const encryptPhone = encrypt({
    plainText: phone,
    signature: process.env.ENCRYPTION_SECRET,
  });

  const user = await UserModel.create({
    userName,
    email,
    password: hasedPassword,
    phone: encryptPhone,
    role,
  });
  emailEmitter.emit("sendAcctivationEmail", user.email, user.userName);
  return res
    .status(200)
    .json({ success: true, message: "User Created Successfully!", user });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    return next(new Error("User dosn't exist!", { cause: 404 }));
  }
  if (user.confirmEmail === false) {
    return next(new Error("Please confirm your account first", {
      cause: 404,
    }));
  }
  const match = compare({ plainText: password, hash: user.password });
  if (!match) {
    return next(new Error("Password is not correct", { cause: 400 }));
  }

  const token = generateToken({
    payload: {
      id: user._id,
      isLoggedIn: true,
    },
    signature:
      user.role === roles.Admin
        ? process.env.TOKEN_SECRET_ADMIN
        : process.env.TOKEN_SECRET_USER,
    options: { expiresIn: "1d" },
  });

  if (user.isDeactivate == true) {
    user.isDeactivate = false;
    await user.save();
  }

  return res
    .status(200)
    .json({ success: true, message: "User login Successfully", token });
};

export const activateAccount = async (req, res, next) => {
  const { token } = req.params;
  const { email } = verify({
    token: token,
    signature: process.env.TOKEN_SECRET_EMAIL,
  });
  const user = await UserModel.findOne({ email });
  if (!user) {
    return next(new Error("User dosn't Exist", { cause: 404 }));
  }
  user.confirmEmail = true;
  await user.save();
  return res
    .status(200)
    .json({ success: true, message: "Email Confirmed Successfully" });
};

///////////////////////////////////
export const forgetPassword = async (req, res, next) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    return next(new Error("User dosn't Exist", { cause: 404 }));
  }
  const token = generateToken({
    payload: { email },
    signature: process.env.TOKEN_SECRET_EMAIL,
  });
  ////
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
  });
  const otpExpier = new Date();
  otpExpier.setMinutes(otpExpier.getMinutes() + 1);

  ////
  if (user.otp.maxOtpAttemps > 0) {
    user.otp.maxOtpAttemps -= 1;
  } else {
    return next(new Error(`Please wait few minutes and try again!`, {
      cause: 401,
    }));
  }
  user.otp.otp = hash({ plainText: otp })
  user.otp.otpExpier = otpExpier.getTime()
  await user.save();
  
  ////send email with OTP
  emailEmitter.emit("sendForgetPasswordEmail", user.email, otp);
  //////
  return res.status(200).json({
    success: true,
    message: "Reset Password Email Sent Successfully",
    token,
  });
};

export const checkOtp = async (req, res, next) => {
  const { otp } = req.body;
  const { token } = req.params;
  const { email } = verify({
    token: token,
    signature: process.env.TOKEN_SECRET_EMAIL,
  });
  const user = await UserModel.findOne({ email });
  if (!user) {
    return next(new Error("User dosn't Exist", { cause: 404 }));
  }
  //////
  if (user.otp.maxOtpAttemps === 0 && user.otp.otpAttempsExpier === null ) {
    //no more attemps
    const otpAttempsExpier = new Date();
    otpAttempsExpier.setMinutes(otpAttempsExpier.getMinutes() + 10);
    user.otp.otpAttempsExpier = otpAttempsExpier;
    await user.save();
    return next(new Error("Please wait 10 minutes and try again!", {
      cause: 401,
    }));
  }
  if (user.otp.otpAttempsExpier > Date.now()) {
    const now = new Date();
    const minutes = now.getMinutes();
    const remainMinutes = user.otp.otpAttempsExpier.getMinutes() - minutes;
    return next(
      new Error(`Please wait ${remainMinutes} minutes and try again!`,
      {
        cause: 401,
      }
    ));
  }
  if (
    user.otp.otpAttempsExpier !== null && // reset maxOtpAttemps & otpAttempsExpier
    user.otp.otpAttempsExpier <= Date.now()
  ) {
    user.otp.maxOtpAttemps = Number(process.env.MAX_OTP_ATTEMPTS);
    user.otp.otpAttempsExpier = null;
    await user.save();
  }

  //////
  const isCorrectOtp = compare({
    plainText: otp,
    hash: user.otp.otp,
  });

  if (Date.now() >= user.otp.otpExpier || isCorrectOtp !== true) {
    return next(new Error("Invalid or expired OTP", { cause: 400 }));
  }
  req.user = user;
  console.log(user);

  return res.status(200).json({
    success: true,
    message: "You Can Reset Password Now",
  });
};

export const resetPassword = async (req, res, next) => {
  const { password } = req.body;
  const hasedPassword = hash({ plainText: password });
  const { token } = req.params;
  const { email } = verify({
    token: token,
    signature: process.env.TOKEN_SECRET_EMAIL,
  });
  await UserModel.findOneAndUpdate(
    { email },
    {
      password: hasedPassword,
      otp: {
        maxOtpAttemps: Number(process.env.MAX_OTP_ATTEMPTS),
        otp: null,
        otpExpier: null,
        otpAttempsExpier: null,
      },
    }
  );
  return res
    .status(200)
    .json({ success: true, message: "Reset Password Successfully" });
};
