import { Router } from "express";
import {
  userGetInformations,
  userLogin,
  userRegister,
  userSetContacts,
} from "../services/userService.js";
import protectMW from "../middlewares/protectMW.js";

const userRoute = Router();

userRoute.post("/users/register", userRegister);
userRoute.post("/users/login", userLogin);

userRoute.put("/users/contacts", protectMW, userSetContacts);
userRoute.get("/users/me", protectMW, userGetInformations);

export { userRoute };
