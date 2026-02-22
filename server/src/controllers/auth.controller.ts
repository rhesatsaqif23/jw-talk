import { Request, Response } from "express";
import * as authService from "../services/auth.service.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { AuthRequest } from "../middlewares/auth.middleware.js";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password)
      return sendError(res, 400, "Email dan password wajib diisi");

    const user = await authService.registerUser(email, password, name);
    return sendSuccess(res, user, "Registrasi berhasil", 201);
  } catch (error: any) {
    return sendError(res, 400, error.message);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const data = await authService.loginUser(email, password);
    return sendSuccess(res, data, "Login berhasil");
  } catch (error: any) {
    return sendError(res, 401, error.message);
  }
};

export const me = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) return sendError(res, 401, "Unauthorized");

    const user = await authService.getUserProfile(req.user.id);
    if (!user) return sendError(res, 404, "User tidak ditemukan");

    return sendSuccess(res, user, "Data user ditemukan");
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};

export const logout = async (req: Request, res: Response) => {
  return sendSuccess(
    res,
    null,
    "Logout berhasil. Silakan hapus token di sisi client.",
  );
};
