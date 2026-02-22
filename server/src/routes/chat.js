import express from "express";
import prisma from "../lib/prisma.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// GET /chat/history
router.get("/history", authMiddleware, async (req, res) => {
    try {
        const { roomId } = req.query;
        const whereClause = roomId ? { roomId: parseInt(roomId) } : {};

        const messages = await prisma.message.findMany({
            where: whereClause,
            orderBy: { createdAt: "asc" },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        res.status(200).json(messages);
    } catch (err) {
        console.error("Chat history error:", err);
        res.status(500).json({ error: "Terjadi kesalahan server" });
    }
});

// GET /chat/rooms
router.get("/rooms", authMiddleware, async (req, res) => {
    try {
        const rooms = await prisma.room.findMany({
            orderBy: { createdAt: "asc" }
        });
        res.status(200).json(rooms);
    } catch (err) {
        res.status(500).json({ error: "Terjadi kesalahan server" });
    }
});

// POST /chat/rooms (Create a new room)
router.post("/rooms", authMiddleware, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ error: "Nama room wajib diisi" });

        const newRoom = await prisma.room.create({
            data: { name }
        });
        res.status(201).json(newRoom);
    } catch (err) {
        res.status(500).json({ error: "Terjadi kesalahan server atau nama room sudah ada" });
    }
});

export default router;
