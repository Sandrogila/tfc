import { auth } from "@/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

// ─────────────────────────────────────────────────────────────────────────────
// lib/auth/permissions.ts — Helpers de permissão (Server Side)
// Use em Server Components e Server Actions para verificar autenticação/roles
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Verifica se o utilizador está autenticado.
 * Redireciona para /login se não estiver.
 * @returns Sessão autenticada
 */
export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return session;
}

/**
 * Verifica se o utilizador tem o role especificado.
 * Redireciona para /nao-autorizado se não tiver.
 * @param role - Role necessária
 */
export async function requireRole(role: Role) {
  const session = await requireAuth();
  if (session.user.role !== role) {
    redirect("/nao-autorizado");
  }
  return session;
}

/**
 * Verifica se o utilizador tem um dos roles especificados.
 * @param roles - Array de roles permitidas
 */
export async function requireAnyRole(roles: Role[]) {
  const session = await requireAuth();
  if (!roles.includes(session.user.role as Role)) {
    redirect("/nao-autorizado");
  }
  return session;
}

// ─── Helpers Booleanos ────────────────────────────────────────────────────────

/**
 * Retorna true se o utilizador é DOCENTE
 */
export async function isDocente(): Promise<boolean> {
  const session = await auth();
  return session?.user?.role === "DOCENTE";
}

/**
 * Retorna true se o utilizador é ESTUDANTE
 */
export async function isEstudante(): Promise<boolean> {
  const session = await auth();
  return session?.user?.role === "ESTUDANTE";
}

/**
 * Retorna true se o utilizador é COORDENACAO
 */
export async function isCoordenacao(): Promise<boolean> {
  const session = await auth();
  return session?.user?.role === "COORDENACAO";
}

// ─── Verificação Inline (sem redirect) ───────────────────────────────────────

/**
 * Verifica role sem redirecionar. Útil para renderização condicional.
 */
export async function checkRole(role: Role): Promise<boolean> {
  const session = await auth();
  return session?.user?.role === role;
}

/**
 * Verifica múltiplos roles sem redirecionar.
 */
export async function checkAnyRole(roles: Role[]): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.role) return false;
  return roles.includes(session.user.role as Role);
}
