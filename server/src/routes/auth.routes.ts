import { Router } from "express";
import { register, login, me, logout } from "../controllers/auth.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Endpoint yang diproteksi middleware
router.get("/me", authenticateToken, me);

export default router;
