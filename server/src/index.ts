import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import prisma from "./lib/prisma.js";
import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import { handleSocketConnection } from "./controllers/socket.controller.js";

const app = express();
const httpServer = createServer(app);

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  }),
);
app.use(express.json());

// Jalankan Socket Controller
handleSocketConnection(io);

// Routing REST API
app.get("/", (req, res) => {
  res.json({ success: true, message: "Welcome to JW-Talks API" });
});
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

// Menggunakan PORT 5000 sebagai default
const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, async () => {
  console.log(`Server JW-Talks berjalan di http://localhost:${PORT}`);

  // Auto-seed: Membuat default room "General" jika database masih kosong (Fitur Anggota 1)
  try {
    const roomCount = await prisma.room.count();
    if (roomCount === 0) {
      await prisma.room.create({
        data: { name: "General" },
      });
      console.log("Created default room 'General'");
    }
  } catch (e) {
    console.error("Failed checking/seeding default room", e);
  }
});
