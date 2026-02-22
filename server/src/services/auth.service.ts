import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

export const registerUser = async (
  email: string,
  passwordHash: string,
  name?: string,
) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("Email sudah terdaftar");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(passwordHash, salt);

  const user = await prisma.user.create({
    data: { email, passwordHash: hashedPassword, name },
    select: { id: true, email: true, name: true, createdAt: true },
  });

  return user;
};

export const loginUser = async (email: string, passwordStr: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Kredensial tidak valid");

  const isMatch = await bcrypt.compare(passwordStr, user.passwordHash);
  if (!isMatch) throw new Error("Kredensial tidak valid");

  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET as string,
    { expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as any },
  );

  return {
    token,
    user: { id: user.id, email: user.email, name: user.name },
  };
};

export const getUserProfile = async (id: number) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });
};
