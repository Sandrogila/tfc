import "next-auth";
import "next-auth/jwt";
import { Role } from "@prisma/client";

// ─────────────────────────────────────────────────────────────────────────────
// Extensão do módulo next-auth para incluir campos customizados
// ─────────────────────────────────────────────────────────────────────────────

declare module "next-auth" {
  interface User {
    role?: Role;
    numero?: string;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: Role;
      numero?: string;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: Role;
    numero?: string;
  }
}

// Re-exports de tipos comuns
export type { Role } from "@prisma/client";
export * from "./auth";
