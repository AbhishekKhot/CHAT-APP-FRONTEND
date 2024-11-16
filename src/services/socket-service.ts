import { io, Socket } from "socket.io-client";

class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public connect(mobileNumber: string) {
    if (!this.socket) {
      this.socket = io(process.env.SOCKET_SERVER_URL, {
        query: { mobileNumber },
      });

      this.socket.on("connect", () => {
        console.log(`Connected with socket ID: ${this.socket?.id}`);
      });

      this.socket.on("disconnect", () => {
        console.log("Disconnected from socket server");
      });
    } else {
      console.log("Already connected to the socket server.");
    }
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public getSocket() {
    return this.socket;
  }
}

export default SocketService.getInstance();
