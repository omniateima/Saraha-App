import jwt from "jsonwebtoken";

export const generateToken = ({ payload, signature, options = {} }) => {
  return jwt.sign(payload, signature, options);
};

export const verify = ({ token, signature, options = {} }) => {
  return jwt.verify(token, signature, options);
};
