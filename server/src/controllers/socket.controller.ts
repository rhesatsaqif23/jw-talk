import { Server, Socket } from "socket.io";
import * as messageService from "../services/message.service.js";
import * as userService from "../services/user.service.js";
import prisma from "../lib/prisma.js"; // Import prisma untuk mengecek eksistensi data
import jwt from "jsonwebtoken";

type AuthSocket = Socket & {
  data: {
    userId?: number;
    email?: string;
    name?: string | null;
  };
};

export const handleSocketConnection = (io: Server) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token as string | undefined;

    if (!token) return next(new Error("Missing access token"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: number;
        email?: string;
        name?: string | null;
      };
      socket.data.userId = decoded.id;
      socket.data.email = decoded.email;
      socket.data.name = decoded.name;
      return next();
    } catch (_error) {
      return next(new Error("Invalid access token"));
    }
  });

  io.on("connection", (socket: AuthSocket) => {
    console.log(`User connected: ${socket.id}`);

    // EVENT: JOIN ROOM
    socket.on("join", async ({ roomId }) => {
      try {
        const userId = socket.data.userId;
        if (!userId) {
          socket.emit("error_event", { message: "Unauthorized socket" });
          return;
        }

        // Cek apakah User benar-benar ada di database
        const userExists = await prisma.user.findUnique({
          where: { id: Number(userId) },
        });
        if (!userExists) {
          console.error(`[Socket Error] Join ditolak: User ID ${userId} tidak ditemukan.`);
          socket.emit("error_event", { message: "User tidak ditemukan di database" });
          return; // Hentikan proses agar tidak error Prisma P2025
        }

        // Cek apakah Room benar-benar ada di database
        const roomExists = await prisma.room.findUnique({ where: { id: Number(roomId) } });
        if (!roomExists) {
          console.error(`[Socket Error] Join ditolak: Room ID ${roomId} tidak ditemukan.`);
          socket.emit("error_event", { message: "Room tidak ditemukan di database" });
          return;
        }

        // Jika aman, lakukan update dan join room
        await userService.updateSocketId(userId, socket.id);
        socket.join(roomId.toString());
        console.log(`User ID ${userId} successfully joined room: ${roomId}`);
      } catch (error) {
        console.error("[Socket System Error] Terjadi kesalahan saat join room:", error);
      }
    });

    // EVENT: KIRIM PESAN
    socket.on("message", async ({ roomId, content }) => {
      try {
        const userId = socket.data.userId;
        if (!userId) return;

        // Validasi input kosong
        if (!content || content.trim() === "") return;

        // Cek eksistensi User
        const userExists = await prisma.user.findUnique({ where: { id: userId } });
        if (!userExists) {
          console.error(`[Socket Error] Pesan ditolak: User ID ${userId} tidak ada.`);
          return; 
        }

        // Cek eksistensi Room
        const roomExists = await prisma.room.findUnique({ where: { id: Number(roomId) } });
        if (!roomExists) {
          console.error(`[Socket Error] Pesan ditolak: Room ID ${roomId} tidak ada.`);
          return;
        }

        // Simpan ke database jika semua valid
        const message = await messageService.createMessage(Number(roomId), userId, content);

        // Broadcast ke semua orang di room tersebut
        io.to(roomId.toString()).emit("message", message);
      } catch (error) {
        console.error("[Socket System Error] Terjadi kesalahan saat mengirim pesan:", error);
      }
    });

    // EVENT: DISCONNECT
    socket.on("disconnect", async () => {
      try {
        await userService.removeSocketId(socket.id);
        console.log(`User disconnected: ${socket.id}`);
      } catch (error) {
        console.error("[Socket System Error] Terjadi kesalahan saat user disconnect:", error);
      }
    });
  });
};
