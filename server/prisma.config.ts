import "dotenv/config";
import { defineConfig } from "@prisma/config";

const dbUrl = process.env.DATABASE_URL;

if (
  !dbUrl ||
  (!dbUrl.startsWith("postgresql://") && !dbUrl.startsWith("postgres://"))
) {
  throw new Error(
    "DATABASE_URL tidak valid atau tidak dimulai dengan protokol yang benar.",
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
