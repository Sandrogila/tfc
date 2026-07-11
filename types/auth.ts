import { Role } from "@prisma/client";

// ─────────────────────────────────────────────────────────────────────────────
// types/auth.ts — Tipos relacionados à autenticação
// ─────────────────────────────────────────────────────────────────────────────

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  numero?: string;
  image?: string | null;
}

export interface AuthSession {
  user: SessionUser;
  expires: string;
}

export type AuthError = {
  type: "credentials" | "session" | "permission";
  message: string;
};
