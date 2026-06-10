import { Server } from "socket.io";

export default function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    socket.on("setup", (userId) => {
      socket.join(userId);

      console.log(`User joined room: ${userId}`);
    });

    socket.on("send-message", (data) => {
      console.log(data);

      io.to(data.receiver).emit("receive-message", data); // ✅ sahi hai
    });

    // Group room join karna
    socket.on("join-group", (groupId) => {
      socket.join(`group-${groupId}`);
      console.log(`User joined group room: group-${groupId}`);
    });

    socket.on("send-group-message", (data) => {
      io.to(`group-${data.groupId}`).emit("receive-group-message", data);
    });

    socket.on("disconnect", () => {
      console.log("User Disconnected:", socket.id);
    });
  });
}
