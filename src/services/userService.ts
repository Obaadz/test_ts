import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import UserModel from "../models/userModel.js";
import generateHashedString from "../utils/generateHashedString.js";
import generateToken from "../utils/generateToken.js";

export const userRegister = asyncHandler(
  async (
    req: Request<
      any,
      any,
      {
        email: string;
        password: string;
        fullName: string;
        phoneNumber: string;
        userName: string;
      }
    >,
    res: Response
  ) => {
    console.log("user register data:", req.body);

    const dbUser = await UserModel.create({
      email: req.body.email,
      password: await generateHashedString(req.body.password),
      fullName: req.body.fullName,
      phoneNumber: req.body.phoneNumber,
      userName: req.body.userName,
    });

    const token = generateToken({ id: dbUser._id });

    res.status(201).json({ isSuccess: true, token });
  }
);

export const userLogin = asyncHandler(
  async (
    req: Request<any, any, { email?: string; userName?: string; password: string }>,
    res: Response
  ) => {
    const dbUser = await UserModel.findOne({
      $or: [{ email: req.body.email }, { userName: req.body.userName }],
    });

    if (!dbUser || !(await dbUser.comparePassword(req.body.password)))
      throw new Error("Email or user name or password is incorrect");

    const token = generateToken({ id: dbUser._id });

    res.status(201).json({ isSuccess: true, token });
  }
);
