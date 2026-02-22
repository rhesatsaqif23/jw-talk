import "dotenv/config";
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import router from "./routes/auth.route.js";

// Setup Pool koneksi database
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const app = express();

// Masukkan adapter ke dalam opsi PrismaClient
export const prisma = new PrismaClient({ adapter });

app.use(cors());
app.use(express.json());

// Rute default untuk mengecek status server
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to JW-Talks API Server!",
    version: "1.0.0",
  });
});

// Routing untuk Autentikasi
app.use("/api/auth", router);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server JW-Talks berjalan di http://localhost:${PORT}`);
});
