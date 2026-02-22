import { Request, Response } from "express";
import * as roomService from "../services/room.service.js";
import * as messageService from "../services/message.service.js";
import { sendSuccess, sendError } from "../utils/response.js";

export const createRoom = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) return sendError(res, 400, "Nama room wajib diisi");

    const room = await roomService.createRoom(name);
    return sendSuccess(res, room, "Room berhasil dibuat", 201);
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};

export const getRooms = async (req: Request, res: Response) => {
  try {
    const rooms = await roomService.getAllRooms();
    return sendSuccess(res, rooms, "Berhasil mengambil daftar room");
  } catch (error: any) {
    return sendError(res, 500, "Internal server error");
  }
};

export const joinChat = async (req: Request, res: Response) => {
  try {
    const { userId, roomId } = req.body; // Diambil dari req.user jika pakai middleware Auth
    if (!userId || !roomId)
      return sendError(res, 400, "userId dan roomId wajib diisi");

    await roomService.addUserToRoom(Number(roomId), Number(userId));
    return sendSuccess(res, null, "Berhasil bergabung ke room");
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { userId, roomId, content } = req.body;
    if (!userId || !roomId || !content)
      return sendError(res, 400, "Semua field wajib diisi");

    const message = await messageService.createMessage(
      Number(roomId),
      Number(userId),
      content,
    );
    return sendSuccess(res, message, "Pesan terkirim", 201);
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};

export const getRoomMessages = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    const messages = await messageService.getMessagesByRoomId(Number(roomId));
    return sendSuccess(res, messages, "Berhasil mengambil pesan");
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};
