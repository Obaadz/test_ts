import loadEnvironment from "./utils/loadEnvironment.js";
loadEnvironment();

import express from "express";
import morgan from "morgan";
import connectMongo from "./utils/connectMongo.js";
import http from "http";
import routes from "./routes/index.js";
import globalErrorMW from "./middlewares/globalErrorMW.js";
import SocketServer from "./socket.js";

connectMongo();

const app = express();

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use("/images", express.static("public/images"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: process.env.DEFAULT_JSON_LIMIT }));

app.get("/ip", (request, response) => response.send(request.ip)); // for testing

app.use(routes);
app.use(globalErrorMW);

const server = http.createServer(app);
const socketServer = SocketServer.getInstance(server);

socketServer.startIOListeners();

server.listen(process.env.PORT, async () => {
  console.log(`Listening on port ${process.env.PORT}`);
});

process.on("uncaughtException", (err) => {
  console.log("caught error:\n", err);
});
