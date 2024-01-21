import { Router } from "express";
import { userRoute } from "./userRoute.js";

const routes = Router();

routes.use("/api", userRoute);

export default routes;
