import type { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import extractTokenFromHeader from "./utils/extractTokenFromHeader.js";
import getUserByToken from "./utils/getUserByToken.js";
import { IUser } from "./models/userModel.js";

type SocketProtected = Socket & {
  dbUser: IUser;
};

export default class SocketServer {
  private io: Server;
  private static instance: SocketServer;

  private constructor(httpServer: HttpServer) {
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
      const lang = socket.handshake.headers["content-language"] || "ar";

      const dbUser = await getUserByToken(token).catch((err) => {
        return null;
      });
      if (!dbUser) return next(new Error("Something incorrect in ws"));

      socket.dbUser = dbUser;

      next();
    });

    this.io.use(async (socket: SocketProtected, next) => {
      next();
    });

    this.io.on("connection", async (socket: SocketProtected) => {
      await this.startListeners(socket);
    });
  }

  private async startListeners(socket: SocketProtected) {
    console.log("SOCKET ID CONNECTED: " + socket.id);
  }
}
