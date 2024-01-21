import { Router } from "express";
import { userLogin, userRegister } from "../services/userService.js";
import protectMW from "../middlewares/protectMW.js";

const userRoute = Router();

userRoute.post("/users/register", userRegister);
userRoute.post("/users/login", userLogin);

export { userRoute };
