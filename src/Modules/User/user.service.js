import { decrypt, encrypt } from "../../utils/encryption/encryption.js";
import UserModel from "../../DB/Models/user.model.js";
import { hash, compare } from "../../utils/hashing/hash.js";

export const getProfile = async (req, res, next) => {
  const { user } = req;
  user.phone = decrypt({
    encrypted: user.phone,
    signature: process.env.ENCRYPTION_SECRET,
  });
  return res
    .status(200)
    .json({ success: true, message: "Done", results: user });
};

export const updateProfile = async (req, res, next) => {
  const userId = req.user._id;
  if (req.body.phone) {
    req.body.phone = encrypt({
      plainText: req.body.phone,
      signature: process.env.ENCRYPTION_SECRET,
    });
  }
  const user = await UserModel.findByIdAndUpdate(
    userId,
    { ...req.body },
    {
      new: true,
      runValidators: true,
    }
  );
  return res
    .status(200) 
    .json({ success: true, message: "Profile Updated ☺️", results: user });
};

export const changePassword = async (req, res, next) => {
  const { oldPassword, password } = req.body;
  const isCorrectPass = compare({
    plainText: oldPassword,
    hash: req.user.password,
  });
  if (!isCorrectPass) {
    return next(new Error("Password is incorrect", { cause: 400 }));
  }

  const hashedPassword = hash({ plainText: password });
  await UserModel.findByIdAndUpdate(req.user._id, {
    password: hashedPassword,
    changedAt: Date.now(),
  },{
    runValidators:true
  });
  return res
    .status(200)
    .json({ success: true, message: "Change Password Successfully" });
};

export const deactivateAccount = async (req, res, next) => {
  await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      isDeactivate: true,
      changedAt: Date.now(),
    },
    {
      runValidators: true,
    }
  );
  return res
    .status(200)
    .json({ success: true, message: "Account Deactivated Successfully"});
};
