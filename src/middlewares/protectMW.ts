import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import extractTokenFromHeader from "../utils/extractTokenFromHeader.js";
import getUserByToken from "../utils/getUserByToken.js";
import { IUser } from "../models/userModel.js";

export type RequestProtectMW<
  ReqParam = any,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
> = Request<ReqParam, ResBody, ReqBody, ReqQuery> & {
  dbUser: IUser;
  token: string;
};

export default asyncHandler(async (req: RequestProtectMW, res: Response, next: NextFunction) => {
  console.log("DEBUG1", req.headers.authorization)
  const token = extractTokenFromHeader(req.headers.authorization);
  console.log("DEBUG2", token)

  const dbUser = await getUserByToken(token);

  req.dbUser = dbUser;
  req.token = token;

  next();
});
