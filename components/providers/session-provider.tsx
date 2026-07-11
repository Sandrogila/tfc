"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

// ─────────────────────────────────────────────────────────────────────────────
// SessionProvider — Provedor de sessão Auth.js para o lado cliente
// ─────────────────────────────────────────────────────────────────────────────

interface SessionProviderProps {
  children: React.ReactNode;
  session?: Session | null;
}

export function SessionProvider({ children, session }: SessionProviderProps) {
  return (
    <NextAuthSessionProvider session={session}>
      {children}
    </NextAuthSessionProvider>
  );
}
