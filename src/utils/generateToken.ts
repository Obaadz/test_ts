import jwt from "jsonwebtoken";

export default (payload: any, expiresIn?: string) =>
  jwt.sign(payload, process.env.SECRET, {
    expiresIn: expiresIn || process.env.JWT_EXPIRE_TIME,
  });
