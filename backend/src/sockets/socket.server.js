import { Server } from "socket.io";

export default function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("User Disconnected:", socket.id);
    });
  });
}
