import { Server } from "socket.io";

let io;

export function GET() {
  if (!io) {
    io = new Server(3001, {
      cors: {
        origin: "*",
      }
    });

    io.on("connection", socket => {
      console.log("User connected:", socket.id);

      socket.on("draw", (data) => {
        socket.broadcast.emit("draw", data);
      });
    });
  }

  return new Response("Socket server running");
}
