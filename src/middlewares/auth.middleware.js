import UserModel from "../DB/Models/user.model.js";
import { verify } from "../utils/token/token.js";
import { asyncHandler } from "../utils/errorHandling/asyncHandler.js";

export const roles = {
  User: "User",
  Admin: "Admin",
};

export const authentication = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next(new Error("Authorize Token is required", { cause: 401 }));
  }
  const [Bearer, token] = authorization.split(" ");
  let TOKEN_SIGNATURE = undefined;

  switch (Bearer) {
    case roles.User:
      TOKEN_SIGNATURE = process.env.TOKEN_SECRET_USER;
      break;

    case roles.Admin:
      TOKEN_SIGNATURE = process.env.TOKEN_SECRET_ADMIN;
      break;

    default:
      break;
  }

  const decoded = verify({ token: token, signature: TOKEN_SIGNATURE });
  if (!decoded?.id) return next(new Error("Invalid Payload", { cause: 401 }));

  const user = await UserModel.findById(decoded.id);
  if (!user) return next(new Error("User not Found", { cause: 404 }));

  if (user.changedAt?.getTime() >= decoded.iat * 1000) {
    return next(new Error("Please login again!", { cause: 401 }));
  }
  if (user.isDeactivate == true) {
    return next(new Error("Please login again!", { cause: 401 }));
  }
  req.user = user;
  return next();
});
export const allowTo = (roles = []) => {
  return asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new Error("You are not allowed!!", { cause: 403 }));
    }
    return next();
  });
};
