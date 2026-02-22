import prisma from "../lib/prisma.js";

export const updateSocketId = async (userId: number, socketId: string) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { socketId },
  });
};

export const removeSocketId = async (socketId: string) => {
  return await prisma.user.updateMany({
    where: { socketId },
    data: { socketId: null },
  });
};
