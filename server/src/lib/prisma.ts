import { createRequire } from "module";
const require = createRequire(import.meta.url);

import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const { PrismaClient } = require("@prisma/client");
const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
});

const adapter = new PrismaPg(pool);

// Inisialisasi
const prisma = new PrismaClient({ adapter });

export default prisma;
