import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// Import Routes & Socket Controller
import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import { handleSocketConnection } from "./controllers/socket.controller.js";

// Setup Database
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });

// Setup Express & HTTP Server
const app = express();
const httpServer = createServer(app);

// Setup Socket.IO
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

const PORT = process.env.PORT || 3001;
// Gunakan httpServer.listen
httpServer.listen(PORT, () => {
  console.log(`Server JW-Talks berjalan di http://localhost:${PORT}`);
});
