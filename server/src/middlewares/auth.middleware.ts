import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: { id: number; email?: string; name?: string | null };
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): any => {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: {
        code: 401,
        message: "Token tidak ditemukan atau format Bearer tidak valid.",
      },
    });
  }

  const token = authHeader.slice("Bearer ".length).trim();
  if (!token) {
    return res.status(401).json({
      success: false,
      error: { code: 401, message: "Token tidak ditemukan." },
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: number;
      email?: string;
      name?: string | null;
    };

    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
    };

    next();
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      error: {
        code: 401,
        message: "Token tidak valid atau sudah kedaluwarsa.",
      },
    });
  }
};
