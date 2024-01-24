import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { IUser } from "./userModel";

export interface IChat extends Document {
  users: Types.ObjectId[] | IUser[];
  messages: {
    content: string;
    from: Types.ObjectId | IUser;
  }[];
  //   unreadFor: Types.ObjectId[] | IUser[];
}

export interface IChatModel extends Model<IChat> {}

const chatSchema: Schema<IChat> = new mongoose.Schema(
  {
    users: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      required: true,
    },
    messages: {
      type: [
        {
          content: {
            type: String,
            required: true,
          },
          from: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
        },
      ],
      default: [],
    },
    // unreadFor: {
    //   type: [mongoose.Schema.Types.ObjectId],
    //   ref: "User",
    //   default: [],
    // },
    __v: {
      type: Number,
      select: false,
    },
  },
  { toJSON: { virtuals: true }, id: true }
);

const ChatModel: IChatModel = mongoose.model<IChat, IChatModel>("Chat", chatSchema);

export default ChatModel;
