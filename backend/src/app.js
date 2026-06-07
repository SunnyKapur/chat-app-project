import express from "express";
import authRoutes from "./routes/auth.routes.js";
import protectedRoutes from "./routes/protected.routes.js";
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/message.route.js"
import cors from "cors"


const app = express();
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
}))
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/me", protectedRoutes);

app.use("/api/messages", messageRoutes);

export default app;
