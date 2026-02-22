import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { sendError } from "../utils/response.js";

export interface AuthRequest extends Request {
  user?: { id: number };
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return sendError(res, 401, "Akses ditolak. Token tidak ditemukan.");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: number;
    };
    req.user = decoded;
    next();
  } catch (error) {
    return sendError(res, 403, "Token tidak valid atau sudah kadaluarsa.");
  }
};
