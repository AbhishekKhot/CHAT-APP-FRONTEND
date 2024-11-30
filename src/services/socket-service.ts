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

  public connect(phoneNumber: string, countryCode: string, options?: any) {
    if (!this.socket) {
      this.socket = io("http://localhost:9000", {
        transports: ["websocket"],
        path: "chat-sockets",
        query: { phoneNumber, countryCode },
        ...options,
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
    this.socket?.disconnect();
    this.socket = null;
  }

  public getSocket() {
    return this.socket;
  }
}

export default SocketService.getInstance();
