import type { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import extractTokenFromHeader from "./utils/extractTokenFromHeader.js";
import getUserByToken from "./utils/getUserByToken.js";
import { IUser } from "./models/userModel.js";
import ChatModel from "./models/chatModel.js";
import { Types } from "mongoose";

type SocketProtected = Socket & {
  dbUser: IUser;
};

type Message = {
  _id: Types.ObjectId;
  id: Types.ObjectId;
  from: string;
  to: string;
  content: string;
};

export default class SocketServer {
  private io: Server;
  private static instance: SocketServer;
  private userSockets: Map<String, SocketProtected>;

  private constructor(httpServer: HttpServer) {
    this.userSockets = new Map();

    this.io = new Server(httpServer, {
      maxHttpBufferSize: Number(process.env.MAX_BUFFER_SIZE),
      cors: {
        origin: "*",
      },
    });
  }

  public static getInstance(httpServer?: HttpServer) {
    if (!SocketServer.instance) SocketServer.instance = new SocketServer(httpServer);

    return SocketServer.instance;
  }

  public startIOListeners() {
    this.io.use(async (socket: SocketProtected, next) => {
      const token = socket.handshake.auth.token
        ? extractTokenFromHeader(socket.handshake.auth.token)
        : extractTokenFromHeader(socket.handshake.headers["authorization"]);

      const dbUser = await getUserByToken(token).catch((err) => {
        return null;
      });

      if (!dbUser) return next(new Error("Something incorrect in socket.io"));

      socket.dbUser = dbUser;
      this.userSockets.set(socket.dbUser._id.toJSON(), socket);

      next();
    });

    this.io.on("connection", async (socket: SocketProtected) => {
      await this.startListeners(socket);
    });
  }

  private async startListeners(socket: SocketProtected) {
    console.log("SOCKET ID CONNECTED: " + socket.id);

    socket.on("sendMessage", async (message: Message) => {
      message.from = socket.dbUser._id.toJSON();
      message._id = message.id = new Types.ObjectId();

      const targetSocket = this.userSockets.get(message.to);

      if (targetSocket) targetSocket.emit("newMessage", message);

      await ChatModel.updateOne(
        { users: { $all: [message.from, message.to] } },
        { $push: { messages: message } }
      );
    });
  }
}
