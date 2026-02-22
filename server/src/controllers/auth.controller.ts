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
  // Logic untuk mengambil profil lengkap bisa ditambahkan di service nanti
  return sendSuccess(res, { id: req.user?.id }, "Data user ditemukan");
};

export const logout = async (req: Request, res: Response) => {
  return sendSuccess(
    res,
    null,
    "Logout berhasil. Silakan hapus token di sisi client.",
  );
};
