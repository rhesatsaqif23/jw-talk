import { Server, Socket } from "socket.io";
import * as messageService from "../services/message.service.js";
import * as userService from "../services/user.service.js";
import prisma from "../lib/prisma.js"; // Import prisma untuk mengecek eksistensi data

export const handleSocketConnection = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    // EVENT: JOIN ROOM
    socket.on("join", async ({ userId, roomId }) => {
      try {
        // Cek apakah User benar-benar ada di database
        const userExists = await prisma.user.findUnique({ where: { id: Number(userId) } });
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
        await userService.updateSocketId(Number(userId), socket.id);
        socket.join(roomId.toString());
        console.log(`User ID ${userId} successfully joined room: ${roomId}`);
      } catch (error) {
        console.error("[Socket System Error] Terjadi kesalahan saat join room:", error);
      }
    });

    // EVENT: KIRIM PESAN
    socket.on("message", async ({ roomId, userId, content }) => {
      try {
        // Validasi input kosong
        if (!content || content.trim() === "") return;

        // Cek eksistensi User
        const userExists = await prisma.user.findUnique({ where: { id: Number(userId) } });
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
        const message = await messageService.createMessage(
          Number(roomId),
          Number(userId),
          content,
        );

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