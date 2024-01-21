import jwt from "jsonwebtoken";

/**
 * @function getDataFromToken
 * @description Get verified data from jwt token and return it, if the token is invalid, an error will be thrown
 */
export default (token: string) => {
  const verifiedToken = jwt.verify(token, process.env.SECRET);

  if (typeof verifiedToken === "string")
    throw new Error("رمز الحساب غير صحيح بالرجاء إعادة المحاوله");

  return verifiedToken;
};
