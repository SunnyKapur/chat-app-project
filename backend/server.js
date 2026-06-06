import dotenv from "dotenv";
import app from "./src/app.js";
import connectDB from "./src/config/database.js";
import { createServer } from "http";
import initSocket from "./src/sockets/socket.server.js";

dotenv.config();

const httpServer = createServer(app);

initSocket(httpServer)

await connectDB();
let port = process.env.PORT || 5000;

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
