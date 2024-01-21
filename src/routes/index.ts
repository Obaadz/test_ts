import { Router } from "express";
import { userRoute } from "./userRoute.js";

const routes = Router();

routes.use("/api/v1", userRoute);

export default routes;
