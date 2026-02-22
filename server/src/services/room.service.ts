import { prisma } from "../index.js";

export const createRoom = async (name: string) => {
  return await prisma.room.create({
    data: { name },
  });
};

export const getAllRooms = async () => {
  return await prisma.room.findMany();
};

export const addUserToRoom = async (roomId: number, userId: number) => {
  return await prisma.room.update({
    where: { id: roomId },
    data: {
      participants: {
        connect: { id: userId },
      },
    },
  });
};
