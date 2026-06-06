import express from "express";
import authRoutes from "./routes/auth.routes.js";
import protectedRoutes from "./routes/protected.routes.js";
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/message.route.js"

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/me", protectedRoutes);

app.use("/api/messages", messageRoutes);

export default app;
