import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import * as dotenv from "dotenv";
import * as path from "path";

// Carrega o .env manualmente para garantir que variáveis como DATABASE_URL estejam
// disponíveis ao executar scripts fora do runtime do Next.js (ex: seed.ts)
dotenv.config({ path: path.resolve(process.cwd(), ".env") });


// ─────────────────────────────────────────────────────────────────────────────
// Singleton do cliente Prisma e do Pool de Conexões pg
// Previne múltiplas instâncias e exaustão de pool durante o hot-reload
// ─────────────────────────────────────────────────────────────────────────────

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
  pgPool: pg.Pool;
};

let prismaInstance: PrismaClient;

const connectionString = process.env.DATABASE_URL;

if (process.env.NODE_ENV === "production") {
  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  prismaInstance = new PrismaClient({ adapter });
} else {
  if (!globalForPrisma.pgPool) {
    globalForPrisma.pgPool = new pg.Pool({ connectionString });
  }
  if (!globalForPrisma.prisma) {
    const adapter = new PrismaPg(globalForPrisma.pgPool);
    globalForPrisma.prisma = new PrismaClient({
      adapter,
      log: ["query", "error", "warn"],
    });
  }
  prismaInstance = globalForPrisma.prisma;
}

export const prisma = prismaInstance;
