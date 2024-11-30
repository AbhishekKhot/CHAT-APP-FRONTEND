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

// import { io, Socket } from "socket.io-client";

// class SocketService {
//   private socket: Socket | null = null;
//   private countryCode: string;
//   private phoneNumber: string;

//   constructor(countryCode: string, phoneNumber: string) {
//     this.countryCode = countryCode;
//     this.phoneNumber = phoneNumber;
//   }

//   public initializeConnection(): Socket {
//     if (this.socket) return this.socket;
//     this.socket = this.getConnection();
//     return this.socket;
//   }

//   private getConnection(options: Record<string, any> = {}): Socket {
//     this.socket = io("http://localhost:9000", {
//       transports: ["websocket"],
//       path: "chat-sockets",
//       query: { phoneNumber: this.phoneNumber, countryCode: "" },
//       ...options,
//     });

//     this.setupSocketListeners();
//     return this.socket;
//   }

//   private setupSocketListeners(): void {
//     if (!this.socket) {
//       console.error("Socket connection not established.");
//       return;
//     }

//     this.socket.on("connect", () => {
//       console.log("Connected to socket server with ID:", this.socket?.id);
//     });

//     this.socket.on("connect_error", (error) => {
//       console.error("Socket connection error:", error);
//     });

//     this.socket.on("disconnect", () => {
//       console.log("Disconnected from socket server.");
//       if (this.countryCode && this.phoneNumber) {
//         setTimeout(() => {
//           this.getConnection();
//         }, 3000);
//       }
//     });
//   }

//   public disconnect(): void {
//     if (this.socket) {
//       this.socket.disconnect();
//       this.socket = null;
//     }
//   }

//   public sendMessage(eventName: string, data: any): void {
//     if (this.socket && this.socket.connected) {
//       this.socket.emit(eventName, data);
//     } else {
//       console.error("Socket not connected. Cannot send message.");
//     }
//   }

//   public on(eventName: string, callback: (...args: any[]) => void): void {
//     if (this.socket) {
//       this.socket.on(eventName, callback);
//     }
//   }

//   public off(eventName: string, callback?: (...args: any[]) => void): void {
//     if (this.socket) {
//       if (callback) {
//         this.socket.off(eventName, callback);
//       } else {
//         this.socket.removeAllListeners(eventName);
//       }
//     }
//   }
// }

// // Factory function to get the socket client instance
// function getSocketClient(countryCode: string, phoneNumber: string): Socket {
//   const socketService = new SocketService(countryCode, phoneNumber);
//   return socketService.initializeConnection();
// }

// export default getSocketClient;
