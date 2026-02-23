import "dotenv/config";
import express from "express";
import cors from "cors";
import prisma from "./lib/prisma.js";
import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.routes.js";
// import { createServer } from "http";
// import { Server as SocketIOServer } from "socket.io";
// import { handleSocketConnection } from "./controllers/socket.controller.js";

const app = express();

const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:3000";

app.use(
  cors({
    origin: clientOrigin,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);
app.use(express.json());

// Routing REST API
app.get("/", (req, res) => {
  res.json({ success: true, message: "Welcome to JW-Talks API on Vercel!" });
});

app.get("/health", (_req, res) => {
  res.json({ success: true, message: "OK" });
});

// Endpoint khusus untuk memicu auto-seed
app.get("/api/init", async (req, res) => {
  try {
    const roomCount = await prisma.room.count();
    if (roomCount === 0) {
      await prisma.room.create({
        data: { name: "General" },
      });
      return res.json({
        success: true,
        message: "Created default room 'General'",
      });
    }
    return res.json({ success: true, message: "Default room already exists" });
  } catch (e: any) {
    return res.status(500).json({ success: false, error: e.message });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

// const PORT = process.env.PORT || 5000;
// httpServer.listen(PORT, async () => { ... });

export default app;
