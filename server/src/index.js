import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import prisma from "./lib/prisma.js";
import authRoutes from "./routes/auth.js";
import chatRoutes from "./routes/chat.js";

const app = express();
const httpServer = createServer(app);

// Setup Socket.io
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CORS_ORIGIN || "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || "*"
}));
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);

// Health check
app.get("/", (req, res) => {
    res.json({ message: "jw-talk server is running" });
});

// Socket.IO Logic
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Bergabung dengan chat
    socket.on("join_chat", () => {
        console.log(`Socket ${socket.id} bergabung ke chat`);
    });

    // Menerima pesan baru dari client
    socket.on("send_message", async (data) => {
        try {
            // Data expected: { content, userId, roomId }
            // Simpan ke database
            const savedMessage = await prisma.message.create({
                data: {
                    content: data.content,
                    userId: data.userId,
                    roomId: data.roomId
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            });

            // Broadcast ke semua client yang konek
            io.emit("receive_message", savedMessage);
        } catch (error) {
            console.error("Error saving message via socket:", error);
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

httpServer.listen(PORT, async () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);

    // Seed default room if zero
    try {
        const roomCount = await prisma.room.count();
        if (roomCount === 0) {
            await prisma.room.create({
                data: { name: "General" }
            });
            console.log("Created default room 'General'");
        }
    } catch (e) {
        console.error("Failed checking/seeding default room", e);
    }
});
