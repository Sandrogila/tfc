import { defineConfig } from "prisma/config";
import * as dotenv from "dotenv";
import * as path from "path";

// ─────────────────────────────────────────────────────────────────────────────
// prisma.config.ts — Configuração do Prisma 7
// Define a localização do schema e a URL de ligação direta para o PostgreSQL (Supabase)
// ─────────────────────────────────────────────────────────────────────────────

// Carrega o .env manualmente para que as variáveis estejam disponíveis
// durante os comandos da CLI do Prisma (db push, migrate, etc)
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Para as operações CLI do Prisma, usamos a conexão direta (DIRECT_URL)
    // para podermos executar migrações e modificações estruturais
    url: process.env.DIRECT_URL || process.env.DATABASE_URL,
  },
});
