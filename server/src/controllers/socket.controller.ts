import { Server, Socket } from "socket.io";
import * as messageService from "../services/message.service.js";
import * as userService from "../services/user.service.js";
import * as roomService from "../services/room.service.js"; // IMPORT BARU UNTUK B
import prisma from "../lib/prisma.js";
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

        // VALIDASI TIPE DATA (String to Number)
        const parsedRoomId = parseInt(roomId);
        if (isNaN(parsedRoomId)) {
          socket.emit("error_event", { message: "Room ID tidak valid" });
          return;
        }

        // Cek apakah User benar-benar ada di database
        const userExists = await prisma.user.findUnique({
          where: { id: userId },
        });
        if (!userExists) {
          console.error(
            `[Socket Error] Join ditolak: User ID ${userId} tidak ditemukan.`,
          );
          socket.emit("error_event", {
            message: "User tidak ditemukan di database",
          });
          return;
        }

        // Cek apakah Room benar-benar ada di database
        const roomExists = await prisma.room.findUnique({
          where: { id: parsedRoomId },
        });
        if (!roomExists) {
          console.error(
            `[Socket Error] Join ditolak: Room ID ${parsedRoomId} tidak ditemukan.`,
          );
          socket.emit("error_event", {
            message: "Room tidak ditemukan di database",
          });
          return;
        }

        // Tambahkan user sebagai partisipan room agar sinkron di DB
        await roomService.addUserToRoom(parsedRoomId, userId);

        // Lakukan update dan join room socket
        await userService.updateSocketId(userId, socket.id);
        socket.join(parsedRoomId.toString());
        console.log(
          `User ID ${userId} successfully joined room: ${parsedRoomId}`,
        );
      } catch (error) {
        console.error(
          "[Socket System Error] Terjadi kesalahan saat join room:",
          error,
        );
        // Beritahu client jika server gagal melakukan proses database
        socket.emit("error_event", {
          message: "Gagal bergabung ke ruangan (Internal Server Error)",
        });
      }
    });

    // EVENT: KIRIM PESAN
    socket.on("message", async ({ roomId, content }) => {
      try {
        const userId = socket.data.userId;
        if (!userId) {
          socket.emit("error_event", { message: "Unauthorized socket" });
          return;
        }

        // VALIDASI TIPE DATA
        const parsedRoomId = parseInt(roomId);
        if (isNaN(parsedRoomId)) {
          socket.emit("error_event", { message: "Room ID tidak valid" });
          return;
        }

        // Validasi input kosong
        if (!content || content.trim() === "") return;

        // Cek eksistensi User
        const userExists = await prisma.user.findUnique({
          where: { id: userId },
        });
        if (!userExists) {
          socket.emit("error_event", {
            message: "Sesi tidak valid, User tidak ditemukan.",
          });
          return;
        }

        // Cek eksistensi Room
        const roomExists = await prisma.room.findUnique({
          where: { id: parsedRoomId },
        });
        if (!roomExists) {
          socket.emit("error_event", {
            message: "Pesan ditolak: Room tidak ada.",
          });
          return;
        }

        // Simpan ke database
        const message = await messageService.createMessage(
          parsedRoomId,
          userId,
          content,
        );

        // Broadcast ke semua orang di room tersebut
        io.to(parsedRoomId.toString()).emit("message", message);
      } catch (error) {
        console.error(
          "[Socket System Error] Terjadi kesalahan saat mengirim pesan:",
          error,
        );
        // Beritahu UI Frontend jika terjadi gagal simpan ke database
        socket.emit("error_event", {
          message: "Gagal mengirim pesan, silakan coba lagi.",
        });
      }
    });

    // EVENT: DISCONNECT
    socket.on("disconnect", async () => {
      try {
        await userService.removeSocketId(socket.id);
        console.log(`User disconnected: ${socket.id}`);
      } catch (error) {
        console.error(
          "[Socket System Error] Terjadi kesalahan saat user disconnect:",
          error,
        );
      }
    });
  });
};
