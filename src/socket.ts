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
  from: Types.ObjectId;
  to: Types.ObjectId;
  content: string;
};

export default class SocketServer {
  private io: Server;
  private static instance: SocketServer;
  private userSockets: Map<String, SocketProtected>;

  private constructor(httpServer: HttpServer) {
    this.userSockets = new Map();

    this.io = new Server(httpServer, {
      allowEIO3: true,
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
      const token = extractTokenFromHeader(
        socket.handshake.query.authorization ||
          socket.handshake.query.Authorization ||
          socket.handshake.auth.token ||
          socket.handshake.headers["authorization"]
      );

      const dbUser = await getUserByToken(token).catch((err) => {
        return null;
      });

      console.log("trying to authorize user...");
      if (!dbUser) return next(new Error("Something incorrect in socket.io"));
      console.log("authorize success");

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

      const targetSocket = this.userSockets.get(message.to as any);

      if (targetSocket)
        targetSocket.emit("newMessage", {
          _id: message._id.toJSON(),
          id: message._id.toJSON(),
          from: message.from,
          to: message.to,
          content: message.content,
        });

      await ChatModel.updateOne(
        { users: { $all: [message.from, message.to] } },
        { $push: { messages: message } }
      );
    });
  }
}
