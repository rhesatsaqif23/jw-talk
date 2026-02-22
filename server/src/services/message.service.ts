import { prisma } from "../index.js";

export const createMessage = async (
  roomId: number,
  userId: number,
  content: string,
) => {
  return await prisma.message.create({
    data: {
      roomId,
      userId,
      content,
    },
    // Include data user agar kita bisa tampilkan nama pengirim di frontend
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });
};

export const getMessagesByRoomId = async (roomId: number) => {
  return await prisma.message.findMany({
    where: { roomId },
    include: {
      user: { select: { name: true } },
    },
    orderBy: { createdAt: "asc" },
  });
};
