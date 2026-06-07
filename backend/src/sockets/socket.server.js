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

      console.log(`User joined room: ${userId}`)
    })

    socket.on("send-message", (data) => {
      console.log(data)
      
      io.to(data.receiverId).emit("receive-message", data)
    })



    socket.on("disconnect", () => {
      console.log("User Disconnected:", socket.id);
    });
  });
}
