import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import userRoutes from "./routes/user.routes";

import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();

// ✅ middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// ================= SOCKET.IO =================
// ================= SOCKET.IO =================
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // 🔥 USER JOINS HIS OWN ROOM
  socket.on("join-room", (userId: string) => {
    console.log("👤 Joined room:", userId);
    if (userId) {
      socket.join(userId);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// 👇 controllers ke liye
app.set("io", io);

// ✅ routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

// ✅ server start
const PORT = 5000;

mongoose
  .connect(process.env.MONGO_URL as string)
  .then(() => {
    console.log("✅ MongoDB connected");
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log("❌ Mongo error:", err));
