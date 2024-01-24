import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import UserModel from "../models/userModel.js";
import generateHashedString from "../utils/generateHashedString.js";
import generateToken from "../utils/generateToken.js";
import { RequestProtectMW } from "../middlewares/protectMW.js";
import ChatModel from "../models/chatModel.js";

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

export const userSetContacts = asyncHandler(
  async (req: RequestProtectMW<any, any, { contacts: string[] }>, res: Response) => {
    const users = await UserModel.find({
      phoneNumber: {
        $in: req.body.contacts || [],
      },
    });

    if (users) await UserModel.updateOne({ _id: req.dbUser._id }, { contacts: users });

    res.status(201).json({ isSuccess: true });
  }
);

export const userGetInformations = asyncHandler(
  async (req: RequestProtectMW<any, any, { contacts: string[] }>, res: Response) => {
    await req.dbUser.populate("contacts", "-password");

    req.dbUser = req.dbUser.toJSON();

    delete req.dbUser.password;
    delete req.dbUser._id;

    req.dbUser.contacts.forEach(async (contact) => {
      const chat = await ChatModel.findOneAndUpdate(
        {
          users: { $all: [req.dbUser._id, contact._id] },
        },
        { users: [req.dbUser._id, contact._id] },
        {
          upsert: true,
          new: true,
        }
      );
      console.log("debug", chat);
      contact.chat = chat;
    });

    res.status(200).json({ isSuccess: true, user: req.dbUser });
  }
);
