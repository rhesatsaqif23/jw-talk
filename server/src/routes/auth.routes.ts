import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

const router = Router();

// POST /api/auth/register - Mendaftarkan user baru dan mengembalikan data tanpa password
router.post("/register", async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({
        success: false,
        error: {
          code: 400,
          message: "Name, email, dan password wajib diisi",
        },
      });

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return res.status(400).json({
        success: false,
        error: { code: 400, message: "Email sudah terdaftar" },
      });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: { name, email, passwordHash: hashedPassword },
    });

    const token = jwt.sign(
      { id: user.id, name: user.name },
      process.env.JWT_SECRET as string,
      { expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as any },
    );

    return res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (err: any) {
    return res
      .status(500)
      .json({ success: false, error: { code: 500, message: err.message } });
  }
});

// POST /api/auth/login - Autentikasi user dan mengembalikan JWT token
router.post("/login", async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({
        success: false,
        error: { code: 400, message: "Email dan password wajib diisi" },
      });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res.status(401).json({
        success: false,
        error: { code: 401, message: "Kredensial tidak valid" },
      });

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid)
      return res.status(401).json({
        success: false,
        error: { code: 401, message: "Kredensial tidak valid" },
      });

    const token = jwt.sign(
      { id: user.id, name: user.name },
      process.env.JWT_SECRET as string,
      { expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as any },
    );

    return res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (err: any) {
    return res
      .status(500)
      .json({ success: false, error: { code: 500, message: err.message } });
  }
});

// POST /api/auth/logout - Menghapus sesi (Frontend cukup menghapus token dari local storage)
router.post("/logout", (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "Logout berhasil. Silakan hapus token di sisi client.",
  });
});

export default router;
