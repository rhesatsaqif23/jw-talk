import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// Menggunakan Pool dari 'pg' untuk koneksi database
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString,
});

const adapter = new PrismaPg(pool);

// Inisialisasi Prisma Client dengan adapter PostgreSQL
const prisma = new PrismaClient({ adapter });

export default prisma;
