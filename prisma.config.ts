import path from "node:path"
import { defineConfig } from "prisma/config"
import { config } from "dotenv"

// Chargement explicite du .env pour que Prisma CLI puisse lire DATABASE_URL
config({ path: path.join(__dirname, ".env") })

export default defineConfig({
  schema: path.join(__dirname, "prisma/schema.prisma"),
  datasource: {
    url: process.env.DATABASE_URL!,
  },
})
