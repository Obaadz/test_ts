import UserModel from "../models/userModel.js";
import getDataFromToken from "./getDataFromToken.js";
import localeMessages from "./localeMessages.js";

/**
 * @function getUserByToken
 * @description Get user by jwt token and return it, if the user is not found, an error will be thrown
 */
export default async (token: string, lang: string = "ar") => {
  const verifiedTokenData = getDataFromToken(token);

  const dbUser = await UserModel.findOne({ _id: verifiedTokenData.userId });

  if (!dbUser) throw new Error(localeMessages[lang]["المستخدم غير موجود"]);

  return dbUser;
};
