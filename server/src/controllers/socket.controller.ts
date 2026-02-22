import { Server, Socket } from "socket.io";
import * as messageService from "../services/message.service.js";
import * as userService from "../services/user.service.js";

export const handleSocketConnection = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    // Event saat user masuk ke room tertentu
    socket.on("join", async ({ userId, roomId }) => {
      await userService.updateSocketId(Number(userId), socket.id);
      socket.join(roomId.toString());
      console.log(`User ID ${userId} joined room: ${roomId}`);
    });

    // Event saat user kirim pesan
    socket.on("message", async ({ roomId, userId, content }) => {
      // Simpan ke database
      const message = await messageService.createMessage(
        Number(roomId),
        Number(userId),
        content,
      );

      // Broadcast ke semua orang di room tersebut
      io.to(roomId.toString()).emit("message", message);
    });

    // Event saat user terputus
    socket.on("disconnect", async () => {
      await userService.removeSocketId(socket.id);
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
