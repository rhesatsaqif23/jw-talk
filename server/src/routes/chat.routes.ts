import { Router, Response } from "express";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import prisma from "../lib/prisma.js";
import { AuthRequest } from "../middlewares/auth.middleware.js";

const router = Router();

// GET /api/chat/history?roomId=1&limit=50 - Mengambil riwayat pesan diurutkan dari yang terlama
router.get(
  "/history",
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const { roomId, limit = 50 } = req.query;
      const whereClause = roomId ? { roomId: parseInt(roomId as string) } : {};

      const messages = await prisma.message.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        take: parseInt(limit as string),
        include: { user: { select: { id: true, name: true } } },
      });

      // Di-reverse agar tampil dari atas ke bawah di UI chat
      return res.status(200).json({ success: true, data: messages.reverse() });
    } catch (err: any) {
      return res
        .status(500)
        .json({ success: false, error: { code: 500, message: err.message } });
    }
  },
);

// GET /api/chat/rooms - Mengambil daftar semua chat room
router.get(
  "/rooms",
  authenticateToken,
  async (_req: AuthRequest, res: Response): Promise<any> => {
    try {
      const rooms = await prisma.room.findMany({
        orderBy: { createdAt: "asc" },
      });
      return res.status(200).json({ success: true, data: rooms });
    } catch (err: any) {
      return res
        .status(500)
        .json({ success: false, error: { code: 500, message: err.message } });
    }
  },
);

// POST /api/chat/rooms - Membuat chat room baru
router.post(
  "/rooms",
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const { name } = req.body;
      if (!name)
        return res.status(400).json({
          success: false,
          error: { code: 400, message: "Nama room wajib diisi" },
        });

      const newRoom = await prisma.room.create({ data: { name } });
      return res.status(201).json({ success: true, data: newRoom });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: {
          code: 500,
          message: "Nama room sudah ada atau terjadi kesalahan",
        },
      });
    }
  },
);

// POST /api/chat/messages - Mengirim pesan via REST (Backup Socket.IO)
router.post(
  "/messages",
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const { roomId, content } = req.body;
      const userId = req.user?.id;

      if (!userId)
        return res.status(401).json({
          success: false,
          error: { code: 401, message: "Unauthorized" },
        });

      if (!roomId || !content)
        return res.status(400).json({
          success: false,
          error: { code: 400, message: "roomId dan content wajib diisi" },
        });

      const newMessage = await prisma.message.create({
        data: { content, roomId: parseInt(roomId), userId },
        include: { user: { select: { id: true, name: true } } },
      });

      return res.status(201).json({ success: true, data: newMessage });
    } catch (err: any) {
      return res
        .status(500)
        .json({ success: false, error: { code: 500, message: err.message } });
    }
  },
);

export default router;
