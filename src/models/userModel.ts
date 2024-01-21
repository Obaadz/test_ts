import mongoose, { Document, Model, Schema, Types } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  fullName: string;
  email: string;
  phoneNumber: string;
  verificationCode: string;
  userName: string;
  password: string;
  compareVerificationCode(verificationCode: string): boolean;
  comparePassword(password: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUser> {}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
    },
    userName: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    verificationCode: {
      type: String,
    },
    __v: {
      type: Number,
      select: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: true,
  }
);

userSchema.virtual("compareVerificationCode").get(function (this: IUser) {
  return (verificationCode: string) => verificationCode === this.verificationCode;
});

userSchema.virtual("comparePassword").get(function (this: IUser) {
  return async (password: string) => {
    try {
      return await bcrypt.compare(password, this.password);
    } catch (error) {
      throw new Error("Error Occured");
    }
  };
});

const UserModel: IUserModel = mongoose.model<IUser, IUserModel>("User", userSchema);

export default UserModel;
