import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: { id: number };
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): any => {
  const authHeader = req.headers.authorization;

  // Validasi ketat format "Bearer" dari versi baru
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: {
        code: 401,
        message: "Akses ditolaToken tidak ditemukan atau format tidak valid.",
      },
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verifikasi token JWT dan cast tipe datanya (dari versi lama)
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: number;
    };

    req.user = decoded;

    next();
  } catch (error: any) {
    console.error("JWT Verify Error:", error.message);

    // Response error standar PRD dengan status 401 (Unauthorized)
    return res.status(401).json({
      success: false,
      error: {
        code: 401,
        message: "Token tidak valid atau sudah kadaluarsa.",
      },
    });
  }
};
